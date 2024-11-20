import { Cashier, CashierId } from '../domain/Cashier';
import { cashierRepository, CashierRepository } from '../domain/CashierRepository';
import { cashierService, CashierService } from '../domain/CashierService';
import { StoreId } from '../../../stores/core/domain/Store';
import { CashierNotFoundInStore } from '../domain/errors/CashierNotFoundInStore';
import { storeRepository, StoreRepository } from '../../../stores/core/domain/StoreRepository';
import { StoreNotFound } from '../../../stores/core/domain/errors/StoreNotFound';
import { CashierAlreadyExists } from '../domain/errors/CashierAlreadyExists';

class CreateCashier {
    constructor(private cashierService: CashierService, private cashierRepository: CashierRepository, private storeRepository: StoreRepository) { }

    async invoke(storeId: StoreId, cashierId: CashierId, externalId: string): Promise<Cashier> {
        const existingCashier = await this.cashierRepository.getById(cashierId);
        if (existingCashier) {
            throw new CashierAlreadyExists(cashierId);
        }

        const mpCashiers = await this.cashierService.getAll(storeId);
        const mpCashier = mpCashiers.find((cashier) => cashier.id === cashierId);
        if (!mpCashier) {
            throw new CashierNotFoundInStore(storeId, cashierId);
        }

        const store = await this.storeRepository.getById(storeId);
        if (!store) {
          throw new StoreNotFound(storeId);
        }

        await this.cashierService.setExternalId(cashierId, store.externalId, externalId);

        return this.cashierRepository.save(Cashier.new({
            id: mpCashier.id,
            name: mpCashier.name,
            dateCreation: mpCashier.dateCreation,
            externalId,
            store: { id: storeId },
        }))
    }
}

export const createCashier = new CreateCashier(cashierService, cashierRepository, storeRepository);
