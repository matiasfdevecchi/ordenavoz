import { removeUndefined } from "../../../shared/domain/utils/object";
import { OrderNotFound } from "../domain/errors/OrderNotFound";
import { Order, OrderId, OrderProps } from "../domain/Order";
import { orderRepository, OrderRepository } from "../domain/OrderRepository";
import { orderService, OrderService } from "../domain/OrderService";

class UpdateOrder {
    constructor(private orderService: OrderService, private repository: OrderRepository) { }

    async invoke(id: OrderId, params: Partial<Omit<OrderProps, "id">>): Promise<Order> {
        const order = await this.repository.getById(id);
        if (!order)
            throw new OrderNotFound(id);

        const updatedOrder = order.copy(removeUndefined(params));
        return this.orderService.update(updatedOrder);
    }
}

export const updateOrder = new UpdateOrder(orderService, orderRepository);