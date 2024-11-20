import { HandledError, ErrorType } from "../../../../../shared/domain/errors/HandledError";
import { DeviceId } from "../Device";
import { PaymentIntentId } from "../PaymentIntent";

export class MercadoPagoIntentAlreadyProcessed extends HandledError {
    constructor(deviceId: DeviceId, paymentIntentId: PaymentIntentId) {
        super({
            type: ErrorType.MERCADO_PAGO_INTENT_ALREADY_PROCESSED,
            params: { deviceId, paymentIntentId },
        });
    }
}