import { HandledError, ErrorType } from "../../../../../shared/domain/errors/HandledError";
import { DeviceId } from "../Device";
import { PaymentIntentId } from "../PaymentIntent";

export class MercadoPagoIntentNotFound extends HandledError {
    constructor(deviceId: DeviceId, paymentIntentId: PaymentIntentId) {
        super({
            type: ErrorType.MERCADO_PAGO_INTENT_NOT_FOUND,
            params: { deviceId, paymentIntentId },
        });
    }
}