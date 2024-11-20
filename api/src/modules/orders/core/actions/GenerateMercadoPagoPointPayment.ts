import { createPaymentIntent, CreatePaymentIntent } from "../../../mercadopago/devices/core/actions/CreatePaymentIntent";
import { DeviceId } from "../../../mercadopago/devices/core/domain/Device";
import { PaymentIntentId } from "../../../mercadopago/devices/core/domain/PaymentIntent";
import { Resource } from "../../../shared/domain/errors/HandledError";
import { InvalidState } from "../../../shared/domain/errors/InvalidState";
import { OrderNotFound } from "../domain/errors/OrderNotFound";
import { OrderId, OrderStatus } from "../domain/Order";
import { orderRepository, OrderRepository } from "../domain/OrderRepository";

class GenerateMercadoPagoPointPaymentIntent {
    constructor(private repository: OrderRepository, private createPaymentIntent: CreatePaymentIntent) { }

    async invoke(id: OrderId, deviceId: DeviceId): Promise<PaymentIntentId> {
        const order = await this.repository.getById(id);
        if (!order)
            throw new OrderNotFound(id);

        if (order.payment || order.status !== OrderStatus.PAYMENT_PENDING)
            throw new InvalidState(
                Resource.ORDER,
                {
                    id,
                    status: order.status,
                    hasPayment: order.payment !== undefined,
                },
                "Order is not in a state to be paid"
            );

        return this.createPaymentIntent.invoke(deviceId, order.total, order.id.toString(), order.id.toString());
    }
}

export const generateMercadoPagoPointPaymentIntent = new GenerateMercadoPagoPointPaymentIntent(orderRepository, createPaymentIntent);