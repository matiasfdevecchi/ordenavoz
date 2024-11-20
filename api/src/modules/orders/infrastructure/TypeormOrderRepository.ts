import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { GetAllParams, OrderRepository } from '../core/domain/OrderRepository';
import { TypeormOrder } from './entity/TypeormOrder';
import { Order, OrderId } from '../core/domain/Order';
import { OrderNotFound } from '../core/domain/errors/OrderNotFound';
import { EntriesResult } from '../../shared/domain/EntriesResult';


export class TypeormOrderRepository implements OrderRepository {
    constructor(
        private repository: Repository<TypeormOrder>,
    ) { }

    private relations: FindOneOptions<TypeormOrder>['relations'] = {
        items: {
            product: {
                category: true,
            },
            variants: {
                removedIngredients: {
                    ingredient: true,
                },
            },
        },
        payment: true,
    }

    async create(order: Order): Promise<Order> {
        const d = TypeormOrder.from(order, true, false);
        const createdOrder = await this.repository.save(d);
        return createdOrder.toDomain();
    }

    async updateWithPayment(order: Order): Promise<Order> {
        const d = TypeormOrder.from(order, false, true);
        const createdOrder = await this.repository.save(d);
        return createdOrder.toDomain();
    }

    async getAll(params: GetAllParams): Promise<EntriesResult<Order>> {
        const where: FindOptionsWhere<TypeormOrder> = {};

        if (params.status) {
            where.status = params.status;
        }

        const [orders, total] = await this.repository.findAndCount({
            where,
            relations: this.relations,
            order: {
                id: params.sortOrder,
            },
            skip: params.pagination.skip(),
            take: params.pagination.take(),
        });

        return {
            entries: orders.map(order => order.toDomain()),
            pagination: {
                page: params.pagination.page,
                pageSize: params.pagination.pageSize,
                total,
            }
        };
    }

    async delete(id: OrderId): Promise<Order> {
        const order = await this.repository.findOne({
            where: { id: id },
            relations: this.relations,
        });
        if (!order) {
            throw new OrderNotFound(id);
        }
        return (await this.repository.remove(order)).toDomain();
    }

    async getById(id: OrderId): Promise<Order | undefined> {
        const order = await this.repository.findOne({
            where: { id },
            relations: this.relations,
        });

        return order?.toDomain() ?? undefined;
    }
}