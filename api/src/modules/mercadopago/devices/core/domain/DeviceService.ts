import { EntriesResult } from "../../../../shared/domain/EntriesResult";
import { Pagination } from "../../../../shared/domain/Pagination";
import { ApiDeviceService } from "../../infrastructure/ApiDeviceService";
import { Device, DeviceId, OperatingMode } from "./Device";
import { PaymentIntentId } from "./PaymentIntent";

export type GetAllParams = {
    pagination: Pagination;
}

export interface DeviceService {
    getAll(params: GetAllParams): Promise<EntriesResult<Device>>;
    updateOperatingMode(id: DeviceId, mode: OperatingMode): Promise<void>;
    createPaymentIntent(deviceId: DeviceId, amount: number, ticketNumber: string, externalReference: string): Promise<PaymentIntentId>;
    cancelPaymentIntent(deviceId: DeviceId, paymentIntentId: PaymentIntentId): Promise<void>;
}

export const deviceService = new ApiDeviceService();