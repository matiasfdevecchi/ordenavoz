import { orderRepository, OrderRepository } from "./OrderRepository";
import { Order, OrderProps } from "./Order";
import { orderNotifier, OrderNotifier } from "./OrderNotifier";

export class OrderService {
    constructor(private orderRepository: OrderRepository, private orderNotifier: OrderNotifier) { }

    async create(props: Omit<OrderProps, 'id'>) {
        return this.orderRepository.create(Order.new(props)).then(order => {
            this.orderNotifier.notifyOrderCreated(order);
            return order;
        });
    }

    async update(order: Order) {
        return this.orderRepository.updateWithPayment(order).then(order => {
            this.orderNotifier.notifyOrderUpdated(order);
            return order;
        });
    }

    async delete(order: Order): Promise<Order> {
        return this.orderRepository.delete(order.id).then(order => {
            this.orderNotifier.notifyOrderDeleted(order);
            return order;
        });
    }
}

export const orderService = new OrderService(orderRepository, orderNotifier);