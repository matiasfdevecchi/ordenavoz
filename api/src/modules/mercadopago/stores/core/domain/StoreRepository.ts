import { typeormUnitOfWork } from "../../../../shared/infrastructure/typeorm/TypeormUnitOfWork";
import { MpUserId } from "../../../types";
import { TypeormStore } from "../../infrastructure/repository/TypeormStore";
import { TypeormStoreRepository } from "../../infrastructure/repository/TypeormStoreRepository";
import { Store, StoreId } from "./Store";

export interface StoreRepository {
    getAll(): Promise<Store[]>;
    getAllByUserId(userId: MpUserId): Promise<Store[]>;
    getById(storeId: StoreId): Promise<Store | undefined>;
    save(store: Store): Promise<Store>;
    delete(id: StoreId): Promise<Store>;
}

export const storeRepository = new TypeormStoreRepository(typeormUnitOfWork.getRepository(TypeormStore));