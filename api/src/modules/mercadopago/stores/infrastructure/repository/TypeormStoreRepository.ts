import { Repository } from 'typeorm';
import { Store, StoreId } from "../../core/domain/Store";
import { TypeormStore } from "./TypeormStore";
import { MpUserId } from "../../../types";
import { StoreRepository } from '../../core/domain/StoreRepository';
import { StoreNotFound } from '../../core/domain/errors/StoreNotFound';

export class TypeormStoreRepository implements StoreRepository {

    constructor(private repository: Repository<TypeormStore>) { }

    async getAll(): Promise<Store[]> {
        const entities = await this.repository.find({
            relations: {
                cashiers: true,
            }
        });
        return entities.map(entity => entity.toDomain());
    }

    async getAllByUserId(userId: MpUserId): Promise<Store[]> {
        const entities = await this.repository.find({
            where: {
                userId: userId,
            }
        });
        return entities.map(entity => entity.toDomain());
    }

    async getById(id: StoreId): Promise<Store | undefined> {
        const entity = await this.repository.findOne({
            where: {
                id,
            }
        });

        return entity ? entity.toDomain() : undefined;
    }

    async save(store: Store): Promise<Store> {
        const entity = TypeormStore.from(store);
        const savedEntity = await this.repository.save(entity);
        return savedEntity.toDomain();
    }

    async delete(id: StoreId): Promise<Store> {
        const store = await this.repository.findOne({
            where: { id: id },
        });
        if (!store) {
            throw new StoreNotFound(id);
        }
        return (await this.repository.remove(store)).toDomain();
    }
}
