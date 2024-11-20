import { printerService, PrinterService } from "../../../printer/domain/PrinterService";
import { BadRequest } from "../../../shared/domain/errors/BadRequest";
import { Resource } from "../../../shared/domain/errors/HandledError";
import { InvalidState } from "../../../shared/domain/errors/InvalidState";
import { OrderNotFound } from "../domain/errors/OrderNotFound";
import { Order, OrderId, OrderStatus, PaymentByCard, PaymentMethod } from "../domain/Order";
import { orderNotifier, OrderNotifier } from "../domain/OrderNotifier";
import { orderRepository, OrderRepository } from "../domain/OrderRepository";
import { orderService, OrderService } from "../domain/OrderService";

class PayOrderByCard {
    constructor(private orderService: OrderService, private repository: OrderRepository, private orderNotifier: OrderNotifier, private printerService: PrinterService) { }

    async invoke(id: OrderId, amount: number, operationId: string | undefined): Promise<Order> {

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

        const payment: PaymentByCard = {
            method: PaymentMethod.CARD,
            operationId,
            amount,
        };

        const updatedOrder = order.copy({ payment, status: OrderStatus.PREPARING });
        const savedOrder = await this.orderService.update(updatedOrder);
        await this.orderNotifier.notifyMercadoPagoPayment(updatedOrder.id);
        await this.printerService.printOrder(order, 'backoffice', false);
        return savedOrder;
    }
}

export const payOrderByCard = new PayOrderByCard(orderService, orderRepository, orderNotifier, printerService);