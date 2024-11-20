import { ExpressApp } from "../../../delivery/http/app";
import { Order, OrderId } from "../core/domain/Order";
import { OrderNotifier } from "../core/domain/OrderNotifier";

export class SocketOrderNotifier implements OrderNotifier {
    async notifyMercadoPagoPayment(orderId: OrderId): Promise<void> {
        ExpressApp.getInstance().emit(`order-${orderId}`, 'paid-by-mercadopago', {});
    }

    async notifyMercadoPagoPaymentCanceled(orderId: OrderId): Promise<void> {
        ExpressApp.getInstance().emit(`order-${orderId}`, 'payment-canceled-by-mercadopago', {});
    }

    async notifyOrderCreated(order: Order): Promise<void> {
        ExpressApp.getInstance().emit('orders', 'order-created', { order });
    }

    async notifyOrderUpdated(order: Order): Promise<void> {
        ExpressApp.getInstance().emit(`orders`, 'order-updated', { order });
    }

    async notifyOrderDeleted(order: Order): Promise<void> {
        ExpressApp.getInstance().emit(`orders`, 'order-deleted', { order });
    }
}