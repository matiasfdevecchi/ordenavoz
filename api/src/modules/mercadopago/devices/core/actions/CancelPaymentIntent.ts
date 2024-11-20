import { DeviceId } from '../domain/Device';
import { deviceService, DeviceService } from '../domain/DeviceService';
import { PaymentIntentId } from '../domain/PaymentIntent';

class CancelPaymentIntent {
    constructor(private deviceService: DeviceService) { }

    invoke(deviceId: DeviceId, id: PaymentIntentId): Promise<void> {
        return this.deviceService.cancelPaymentIntent(deviceId, id);
    }
}

export const cancelPaymentIntent = new CancelPaymentIntent(deviceService);
