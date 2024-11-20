import { MpUserId } from '../../../types';
import { Store } from '../domain/Store';
import { storeService, StoreService } from '../domain/StoreService';

class GetAllMercadoPagoStores {
  constructor(private storeService: StoreService) { }

  invoke(userId: MpUserId): Promise<Store[]> {
    return this.storeService.getAll(userId);
  }
}

export const getAllMercadoPagoStores = new GetAllMercadoPagoStores(storeService);
