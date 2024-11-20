import { EntriesResult } from '../../../shared/domain/EntriesResult';
import { Pagination } from '../../../shared/domain/Pagination';
import { typeormUnitOfWork } from '../../../shared/infrastructure/typeorm/TypeormUnitOfWork';
import { TypeormOrder } from '../../infrastructure/entity/TypeormOrder';
import { TypeormOrderRepository } from '../../infrastructure/TypeormOrderRepository';
import { Order, OrderId, OrderStatus } from './Order';

export type GetAllParams = {
  status?: OrderStatus;
  sortOrder?: 'ASC' | 'DESC';
  pagination: Pagination;
}

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  updateWithPayment(order: Order): Promise<Order>;
  getById(id: OrderId): Promise<Order | undefined>;
  getAll(params: GetAllParams): Promise<EntriesResult<Order>>;
  delete(id: OrderId): Promise<Order>;
}

export const orderRepository = new TypeormOrderRepository(
  typeormUnitOfWork.getRepository(TypeormOrder),
);
