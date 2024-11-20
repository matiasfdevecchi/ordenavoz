import { HandledError, ErrorType } from "../../../../../shared/domain/errors/HandledError";
import { DeviceId } from "../Device";

export class MercadoPagoDeviceForbidden extends HandledError {
    constructor(deviceId: DeviceId) {
        super({
            type: ErrorType.MERCADO_PAGO_DEVICE_FORBIDDEN,
            params: { deviceId },
        });
    }
}