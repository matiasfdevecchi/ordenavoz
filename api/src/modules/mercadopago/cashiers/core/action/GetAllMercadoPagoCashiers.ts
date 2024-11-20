import { StoreId } from '../../../stores/core/domain/Store';
import { Cashier } from '../domain/Cashier';
import { cashierService, CashierService } from '../domain/CashierService';

class GetAllMercadoPagoCashiers {
  constructor(private cashierService: CashierService) { }

  invoke(storeId: StoreId): Promise<Cashier[]> {
    return this.cashierService.getAll(storeId);
  }
}

export const getAllMercadoPagoCashiers = new GetAllMercadoPagoCashiers(cashierService);
