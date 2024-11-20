import MercadoPagoConfig, { MerchantOrder, Payment } from "mercadopago";
import Controller from "./controller";
import { Mutex } from "async-mutex";
import { payOrderByMercadoPago } from "../../../modules/orders/core/actions/PayOrderByMercadoPago";
import { orderNotifier } from "../../../modules/orders/core/domain/OrderNotifier";
import { payOrderByCard } from "../../../modules/orders/core/actions/PayOrderByCard";

const mutex = new Mutex();

export const listenMercadoPagoController: Controller = async (req, res) => {
    const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });

    res.status(200).json({ message: 'ok' });

    if (req.body.type === 'topic_merchant_order_wh') {
        console.log("merchant_order");
        const merchantOrderApi = new MerchantOrder(client);
        const order = await merchantOrderApi.get({
            merchantOrderId: req.body.id,
        });

        const externalReference = order.external_reference;

        if (order.order_status !== 'paid'
            || externalReference === undefined) {
            return;
        }

        const release = await mutex.acquire();

        try {
            let operationId: number | undefined;
            if (order.payments) {
                if (order.payments.length > 0) {
                    operationId = order.payments[0].id;
                }
            }
            await payOrderByMercadoPago.invoke(parseInt(externalReference), order.paid_amount || 0, operationId?.toString());
        } finally {
            release();
        }
    } else if (req.body.intent_type === 'payment') {
        console.log("payment");
        if (req.body.state === 'CANCELED') {
            const externalReference = req.body.additional_info.external_reference || "0";
            orderNotifier.notifyMercadoPagoPaymentCanceled(parseInt(externalReference));
        } else {
            const paymentApi = new Payment(client);
    
            const payment = await paymentApi.get({
                id: req.body.payment.id,
            });
    
            const externalReference = payment.external_reference;
    
            if (payment.status !== 'approved'
                || externalReference === undefined
                || payment.transaction_details?.net_received_amount === undefined) {
                return;
            }
    
            const release = await mutex.acquire();
    
            try {
                const operationId = payment.id;
                const amount = payment.transaction_details?.total_paid_amount || 0;
                await payOrderByCard.invoke(parseInt(externalReference), amount, operationId?.toString());
            } finally {
                release();
            }
        }
    }
}