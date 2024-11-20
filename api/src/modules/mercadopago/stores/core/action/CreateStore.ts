import { MpUserId } from '../../../types';
import { StoreAlreadyExists } from '../domain/errors/StoreAlreadyExists';
import { StoreNotFoundInMpUser } from '../domain/errors/StoreNotFoundInMpUser';
import { Store, StoreId } from '../domain/Store';
import { storeRepository, StoreRepository } from '../domain/StoreRepository';
import { storeService, StoreService } from '../domain/StoreService';

class CreateStore {
    constructor(private storeService: StoreService, private storeRepository: StoreRepository) { }

    async invoke(userId: MpUserId, storeId: StoreId, externalId: string): Promise<Store> {
        const existingStore = await this.storeRepository.getById(storeId);
        if (existingStore) {
            throw new StoreAlreadyExists(storeId);
        }

        const mpStores = await this.storeService.getAll(userId);
        const mpStore = mpStores.find((store) => store.id === storeId);
        if (!mpStore) {
            throw new StoreNotFoundInMpUser(userId, storeId);
        }

        await this.storeService.setExternalId(userId, storeId, externalId);

        return this.storeRepository.save(Store.new({
            id: mpStore.id,
            name: mpStore.name,
            userId,
            dateCreation: mpStore.dateCreation,
            externalId,
        }))
    }
}

export const createStore = new CreateStore(storeService, storeRepository);
