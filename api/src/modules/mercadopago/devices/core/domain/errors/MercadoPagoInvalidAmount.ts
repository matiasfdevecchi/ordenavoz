import { HandledError, ErrorType } from "../../../../../shared/domain/errors/HandledError";

export class MercadoPagoInvalidAmount extends HandledError {
    constructor(min: number, current: number) {
        super({
            type: ErrorType.MERCADO_PAGO_INVALID_AMOUNT,
            params: { min, current, },
        });
    }
}