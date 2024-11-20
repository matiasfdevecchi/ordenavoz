import { typeormUnitOfWork } from "../../../../shared/infrastructure/typeorm/TypeormUnitOfWork";
import { StoreId } from "../../../stores/core/domain/Store";
import { TypeormCashier } from "../../infrastructure/repository/TypeormCashier";
import { TypeormCashierRepository } from "../../infrastructure/repository/TypeormCashierRepository";
import { Cashier, CashierId } from "./Cashier";

export interface CashierRepository {
    getAll(): Promise<Cashier[]>;
    getAllByStoreId(storeId: StoreId): Promise<Cashier[]>;
    getById(id: CashierId): Promise<Cashier | undefined>;
    getDynamic(): Promise<Cashier | undefined>;
    save(cashier: Cashier): Promise<Cashier>;
    delete(id: CashierId): Promise<Cashier>;
}

export const cashierRepository = new TypeormCashierRepository(typeormUnitOfWork.getRepository(TypeormCashier));