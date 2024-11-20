import { Cashier } from '../domain/Cashier';
import { cashierRepository, CashierRepository } from '../domain/CashierRepository';

class GetAllCashiers {
  constructor(private cashierRepository: CashierRepository) { }

  invoke(): Promise<Cashier[]> {
    return this.cashierRepository.getAll();
  }
}

export const getAllCashiers = new GetAllCashiers(cashierRepository);
