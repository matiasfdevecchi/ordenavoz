import { SocketOrderNotifier } from "../../infrastructure/SocketOrderNotifier";
import { Order, OrderId } from "./Order";

export interface OrderNotifier {
    notifyMercadoPagoPayment(orderId: OrderId): Promise<void>;
    notifyMercadoPagoPaymentCanceled(orderId: OrderId): Promise<void>;
    notifyOrderCreated(order: Order): Promise<void>;
    notifyOrderUpdated(order: Order): Promise<void>;
    notifyOrderDeleted(order: Order): Promise<void>;
}

export const orderNotifier: OrderNotifier = new SocketOrderNotifier();