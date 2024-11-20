import { OrderNotFound } from '../domain/errors/OrderNotFound';
import { Order, OrderId } from '../domain/Order';
import { orderRepository, OrderRepository } from '../domain/OrderRepository';

class GetOrderById {
  constructor(private orderRepository: OrderRepository) { }

  async invoke(id: OrderId): Promise<Order> {
    const order = await this.orderRepository.getById(id);
    if (!order)
      throw new OrderNotFound(id);
    return order;
  }
}

export const getOrderById = new GetOrderById(orderRepository);
