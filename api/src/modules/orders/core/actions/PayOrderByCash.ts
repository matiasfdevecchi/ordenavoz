import { printerService, PrinterService } from "../../../printer/domain/PrinterService";
import { BadRequest } from "../../../shared/domain/errors/BadRequest";
import { Resource } from "../../../shared/domain/errors/HandledError";
import { InvalidState } from "../../../shared/domain/errors/InvalidState";
import { OrderNotFound } from "../domain/errors/OrderNotFound";
import { Order, OrderId, OrderStatus, PaymentByCash, PaymentMethod } from "../domain/Order";
import { orderRepository, OrderRepository } from "../domain/OrderRepository";
import { orderService, OrderService } from "../domain/OrderService";

class PayOrderByCash {
    constructor(private orderService: OrderService, private repository: OrderRepository, private printerService: PrinterService) { }

    async invoke(id: OrderId, method: PaymentMethod, amount: number): Promise<Order> {

        const payment = this.getPayment(method, amount);

        if (amount <= 0)
            throw new BadRequest("Invalid payment amount");

        const order = await this.repository.getById(id);
        if (!order)
            throw new OrderNotFound(id);

        if (order.payment || order.status !== OrderStatus.PAYMENT_PENDING)
            throw new InvalidState(
                Resource.ORDER,
                {
                    id,
                    status: order.status,
                    hasPayment: order.payment !== undefined,
                },
                "Order is not in a state to be paid"
            );

        const updatedOrder = order.copy({ payment, status: OrderStatus.PREPARING });
        const savedOrder = await this.orderService.update(updatedOrder);
        await this.printerService.printOrder(order, 'backoffice', false);
        return savedOrder;
    }

    private getPayment(method: PaymentMethod, amount: number): PaymentByCash {
        if (method !== PaymentMethod.CASH)
            throw new BadRequest("Invalid payment method");

        return {
            method,
            amount,
        };
    }
}

export const payOrderByCash = new PayOrderByCash(orderService, orderRepository, printerService);