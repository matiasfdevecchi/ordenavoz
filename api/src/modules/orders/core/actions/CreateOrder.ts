import { printerService, PrinterService } from '../../../printer/domain/PrinterService';
import { Resource } from '../../../shared/domain/errors/HandledError';
import { InvalidState } from '../../../shared/domain/errors/InvalidState';
import { Order, OrderItem, OrderProps, OrderStatus, Variant } from '../domain/Order';
import { OrderRepository, orderRepository } from '../domain/OrderRepository';
import { orderService, OrderService } from '../domain/OrderService';

class CreateOrder {
  constructor(private orderService: OrderService, private orderRepository: OrderRepository, private printerService: PrinterService) { }

  async invoke(props: Omit<OrderProps, 'id' | 'dateCreated' | 'status' | 'total' | 'payment'>, from: 'backoffice' | 'client', printPendingTicket: boolean): Promise<Order> {
    const items = props.items
      .map((item: OrderItem) => {
        return {
          ...item,
          variants: item.variants.filter((variant: Variant) => variant.quantity > 0),
        };
      })
      .filter((item: OrderItem) => item.variants.length > 0);

    if (items.length === 0) {
      throw new InvalidState(
        Resource.ORDER,
        {},
        'Order must have at least one item with at least one variant with quantity greater than 0'
      )
    }

    const order = await this.orderService.create({
      items,
      dateCreated: new Date(),
      status: OrderStatus.PAYMENT_PENDING,
      total: props.items.reduce((prev: number, curr: OrderItem) => {
        return prev + curr.variants.reduce((acc: number, v: Variant) => {
          return acc + v.quantity * curr.price;
        }, 0);
      }, 0),
      payment: undefined,
    });

    if (printPendingTicket) {
      const savedOrder = await this.orderRepository.getById(order.id);
      await this.printerService.printOrder(savedOrder ?? order, from, true);
    }

    return order;
  }
}

export const createOrder = new CreateOrder(orderService, orderRepository, printerService);
