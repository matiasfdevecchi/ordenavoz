import { MpUserId } from '../../../types';
import { qrPaymentService, QRPaymentService } from '../domain/QRPaymentService';

export class CreateDynamicQRPayment {
  constructor(private qrPaymentService: QRPaymentService) { }

  invoke(userId: MpUserId, reference: string, externalCashierId: string, amount: number): Promise<string> {
    return this.qrPaymentService.createDynamic(userId, reference, externalCashierId, amount);
  }
}

export const createDynamicQRPayment = new CreateDynamicQRPayment(qrPaymentService);
