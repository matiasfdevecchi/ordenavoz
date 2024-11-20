import { ErrorType, HandledError } from "../../../../../shared/domain/errors/HandledError";

export class DynamicCashierNotFound extends HandledError {
    constructor() {
        super({
            type: ErrorType.MERCADO_PAGO_DYNAMIC_CASHIER_NOT_FOUND,
            params: {},
        });
    }
}