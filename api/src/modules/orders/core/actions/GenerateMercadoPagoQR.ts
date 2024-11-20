import { CashierId } from "../../../mercadopago/cashiers/core/domain/Cashier";
import { cashierRepository, CashierRepository } from "../../../mercadopago/cashiers/core/domain/CashierRepository";
import { CashierNotFound } from "../../../mercadopago/cashiers/core/domain/errors/CashierNotFound";
import { createQRPayment, CreateQRPayment } from "../../../mercadopago/payments/core/action/CreateQRPayment";
import { Resource } from "../../../shared/domain/errors/HandledError";
import { InvalidState } from "../../../shared/domain/errors/InvalidState";
import { OrderNotFound } from "../domain/errors/OrderNotFound";
import { OrderId, OrderStatus } from "../domain/Order";
import { orderRepository, OrderRepository } from "../domain/OrderRepository";

class GenerateMercadoPagoQR {
    constructor(private repository: OrderRepository, private createQRPayment: CreateQRPayment, private cashierRepository: CashierRepository) { }

    async invoke(id: OrderId, cashierId: CashierId): Promise<void> {
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

        const cashier = await this.cashierRepository.getById(cashierId);
        if (!cashier)
            throw new CashierNotFound(cashierId);

        if (cashier.store.userId === undefined || cashier.store.externalId === undefined)
            throw new Error("Some attributes are missing in the cashier store");

        await this.createQRPayment.invoke(cashier.store.userId, order.id.toString(), cashier.store.externalId, cashier.externalId, order.total);
    }
}

export const generateMercadoPagoQR = new GenerateMercadoPagoQR(orderRepository, createQRPayment, cashierRepository);