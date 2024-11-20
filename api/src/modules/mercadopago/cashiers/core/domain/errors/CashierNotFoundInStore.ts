import { ErrorType, HandledError } from "../../../../../shared/domain/errors/HandledError";
import { StoreId } from "../../../../stores/core/domain/Store";
import { CashierId } from "../Cashier";

export class CashierNotFoundInStore extends HandledError {
    constructor(storeId: StoreId, cashierId: CashierId) {
        super({
            type: ErrorType.MERCADO_PAGO_CASHIER_NOT_FOUND,
            params: { storeId, cashierId },
        });
    }
}