import { cashierRepository, CashierRepository } from '../domain/CashierRepository';
import { Cashier, CashierId } from '../domain/Cashier';

class DeleteCashier {
  constructor(private cashierRepository: CashierRepository) { }

  invoke(id: CashierId): Promise<Cashier> {
    return this.cashierRepository.delete(id);
  }
}

export const deleteCashier = new DeleteCashier(cashierRepository);
