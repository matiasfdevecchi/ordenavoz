import { orderRepository, OrderRepository } from '../domain/OrderRepository';
import { Order, OrderId } from '../domain/Order';
import { orderService, OrderService } from '../domain/OrderService';
import { OrderNotFound } from '../domain/errors/OrderNotFound';

class DeleteOrder {
  constructor(private orderService: OrderService, private orderRepository: OrderRepository) { }

  invoke(id: OrderId): Promise<Order> {
    return this.orderRepository.getById(id).then((order) => {
      if (!order) {
        throw new OrderNotFound(id);
      }
      return this.orderService.delete(order);
    });
  }
}

export const deleteOrder = new DeleteOrder(orderService, orderRepository);
