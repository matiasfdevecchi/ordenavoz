import { Cashier, CashierId } from '../domain/Cashier';
import { cashierService, CashierService } from '../domain/CashierService';

class SetCashierExternalId {
  constructor(private cashierService: CashierService) { }

  invoke(cashierId: CashierId, externalStoreId: string, externalId: string): Promise<void> {
    return this.cashierService.setExternalId(cashierId, externalStoreId, externalId);
  }
}

export const setCashierExternalId = new SetCashierExternalId (cashierService);
