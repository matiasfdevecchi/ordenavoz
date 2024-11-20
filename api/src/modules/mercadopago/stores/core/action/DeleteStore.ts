import { storeRepository, StoreRepository } from '../domain/StoreRepository';
import { Store, StoreId } from '../domain/Store';

class DeleteStore {
  constructor(private storeRepository: StoreRepository) { }

  invoke(id: StoreId): Promise<Store> {
    return this.storeRepository.delete(id);
  }
}

export const deleteStore = new DeleteStore(storeRepository);
