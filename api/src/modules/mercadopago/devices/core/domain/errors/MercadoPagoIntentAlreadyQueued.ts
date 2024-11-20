import { HandledError, ErrorType } from "../../../../../shared/domain/errors/HandledError";
import { DeviceId } from "../Device";

export class MercadoPagoIntentAlreadyQueued extends HandledError {
    constructor(deviceId: DeviceId) {
        super({
            type: ErrorType.MERCADO_PAGO_INTENT_ALREADY_QUEUED,
            params: { deviceId },
        });
    }
}