import { MpUserId } from "../../../types";
import { ApiStoreService } from "../../infrastructure/ApiStoreService";
import { Store } from "./Store";

export interface StoreService {
    setExternalId(userId: MpUserId, storeId: string, externalId: string): Promise<void>;
    getAll(userId: MpUserId): Promise<Store[]>;
}

export const storeService = new ApiStoreService();