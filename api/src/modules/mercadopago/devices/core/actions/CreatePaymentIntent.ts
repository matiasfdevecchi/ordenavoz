import { DeviceId, OperatingMode } from '../domain/Device';
import { deviceService, DeviceService } from '../domain/DeviceService';
import { PaymentIntentId } from '../domain/PaymentIntent';

export class CreatePaymentIntent {
    constructor(private deviceService: DeviceService) { }

    invoke(deviceId: DeviceId, amount: number, ticketNumber: string, externalReference: string): Promise<PaymentIntentId> {
        return this.deviceService.createPaymentIntent(deviceId, amount, ticketNumber, externalReference);
    }
}

export const createPaymentIntent = new CreatePaymentIntent(deviceService);
