import { MpUserId } from '../../../types';
import { qrPaymentService, QRPaymentService } from '../domain/QRPaymentService';

export class CreateQRPayment {
  constructor(private qrPaymentService: QRPaymentService) { }

  invoke(userId: MpUserId, reference: string, externalStoreId: string, externalCashierId: string, amount: number): Promise<void> {
    return this.qrPaymentService.create(userId, reference, externalStoreId, externalCashierId, amount);
  }
}

export const createQRPayment = new CreateQRPayment(qrPaymentService);
