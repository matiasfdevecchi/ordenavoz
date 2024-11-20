import { StoreId } from "../../../stores/core/domain/Store";
import { ApiCashierService } from "../../infrastructure/ApiCashierService";
import { Cashier, CashierId } from "./Cashier";

export interface CashierService {
    setExternalId(cashierId: CashierId, externalStoreId: string, externalId: string): Promise<void>;
    getAll(storeId: StoreId): Promise<Cashier[]>;
}

export const cashierService = new ApiCashierService();