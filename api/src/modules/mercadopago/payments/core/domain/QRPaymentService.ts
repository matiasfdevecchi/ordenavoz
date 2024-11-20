import { MpUserId } from "../../../types";
import { ApiQRPaymentService } from "../../infrastructure/ApiQRPaymentService";

export interface QRPaymentService {
    create(userId: MpUserId, reference: string, externalStoreId: string, externalCashierId: string, amount: number): Promise<void>;
    createDynamic(userId: MpUserId, reference: string, externalCashierId: string, amount: number): Promise<string>;
}

export const qrPaymentService = new ApiQRPaymentService();