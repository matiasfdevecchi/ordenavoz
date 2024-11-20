import { EntriesResult } from '../../../shared/domain/EntriesResult';
import { Order } from '../domain/Order';
import { GetAllParams, orderRepository, OrderRepository } from '../domain/OrderRepository';

class GetAllOrders {
  constructor(private orderRepository: OrderRepository) { }

  invoke(params: GetAllParams): Promise<EntriesResult<Order>> {
    return this.orderRepository.getAll(params);
  }
}

export const getAllOrders = new GetAllOrders(orderRepository);
