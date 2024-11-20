import { ILike, Repository } from 'typeorm';
import { Cashier, CashierId } from "../../core/domain/Cashier";
import { CashierRepository } from "../../core/domain/CashierRepository";
import { TypeormCashier } from "./TypeormCashier";
import { StoreId } from "../../../stores/core/domain/Store";
import { CashierNotFound } from '../../core/domain/errors/CashierNotFound';

export class TypeormCashierRepository implements CashierRepository {

    constructor(private repository: Repository<TypeormCashier>) { }

    async getAll(): Promise<Cashier[]> {
        const entities = await this.repository.find({
            relations: {
                store: true,
            }
        });
        return entities.map(entity => entity.toDomain());
    }

    async getAllByStoreId(storeId: StoreId): Promise<Cashier[]> {
        const entities = await this.repository.find({
            where: {
                storeId: storeId,
            }
        });
        return entities.map(entity => entity.toDomain());
    }

    async getById(id: CashierId): Promise<Cashier | undefined> {
        const entity = await this.repository.findOne({
            where: {
                id,
            },
            relations: {
                store: true,
            }
        });

        return entity ? entity.toDomain() : undefined;
    }

    async getDynamic(): Promise<Cashier | undefined> {
        const entity = await this.repository.findOne({
            where: {
                name: ILike('%dinamico%'),
            },
            relations: {
                store: true,
            }
        });

        return entity ? entity.toDomain() : undefined;
    }

    async save(cashier: Cashier): Promise<Cashier> {
        const entity = TypeormCashier.from(cashier);
        const savedEntity = await this.repository.save(entity);
        return savedEntity.toDomain();
    }

    async delete(id: CashierId): Promise<Cashier> {
        const cashier = await this.repository.findOne({
            where: { id: id },
        });
        if (!cashier) {
            throw new CashierNotFound(id);
        }
        return (await this.repository.remove(cashier)).toDomain();
    }
}
