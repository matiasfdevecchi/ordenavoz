import { cashierRepository, CashierRepository } from "../../../mercadopago/cashiers/core/domain/CashierRepository";
import { DynamicCashierNotFound } from "../../../mercadopago/cashiers/core/domain/errors/DynamicCashierNotFound";
import { CreateDynamicQRPayment, createDynamicQRPayment } from "../../../mercadopago/payments/core/action/CreateDynamicQRPayment";
import { Resource } from "../../../shared/domain/errors/HandledError";
import { InvalidState } from "../../../shared/domain/errors/InvalidState";
import { OrderNotFound } from "../domain/errors/OrderNotFound";
import { OrderId, OrderStatus } from "../domain/Order";
import { orderRepository, OrderRepository } from "../domain/OrderRepository";

class GenerateMercadoPagoDynamicQR {
    constructor(private repository: OrderRepository, private createQRPayment: CreateDynamicQRPayment, private cashierRepository: CashierRepository) { }

    async invoke(id: OrderId): Promise<string> {
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

        const cashier = await this.cashierRepository.getDynamic();
        if (!cashier)
            throw new DynamicCashierNotFound();

        if (cashier.store.userId === undefined || cashier.store.externalId === undefined)
            throw new Error("Some attributes are missing in the cashier store");

        return await this.createQRPayment.invoke(cashier.store.userId, order.id.toString(), cashier.externalId, order.total);
    }
}

export const generateMercadoPagoDynamicQR = new GenerateMercadoPagoDynamicQR(orderRepository, createDynamicQRPayment, cashierRepository);