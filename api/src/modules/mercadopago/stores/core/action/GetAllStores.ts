import { Store } from '../domain/Store';
import { storeRepository, StoreRepository } from '../domain/StoreRepository';

class GetAllStores {
  constructor(private storeRepository: StoreRepository) { }

  invoke(): Promise<Store[]> {
    return this.storeRepository.getAll();
  }
}

export const getAllStores = new GetAllStores(storeRepository);
