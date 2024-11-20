import { ErrorType, HandledError } from "../../shared/domain/errors/HandledError";
import { MpUserId } from "../types";

export class MercadoPagoConflict extends HandledError {
    constructor(userId: MpUserId) {
        super({
            type: ErrorType.MERCADO_PAGO_CONFLICT,
            params: { userId },
        });
    }
}