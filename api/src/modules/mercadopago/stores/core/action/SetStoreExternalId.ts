import { MpUserId } from '../../../types';
import { Store, StoreId } from '../domain/Store';
import { storeService, StoreService } from '../domain/StoreService';

class SetStoreExternalId {
  constructor(private storeService: StoreService) { }

  invoke(userId: MpUserId, storeId: StoreId, externalId: string): Promise<void> {
    return this.storeService.setExternalId(userId, storeId, externalId);
  }
}

export const setStoreExternalId = new SetStoreExternalId (storeService);
