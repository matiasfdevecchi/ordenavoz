import { Cashier } from "../cashiers/Cashier";
import { MpUserId } from "../types";

export type StoreId = string;

export type StoreProps = {
    id: StoreId;
    name: string;
    dateCreation: string;
    externalId: string;
    userId: MpUserId;
    cashiers?: Cashier[];
}

export class Store {
    readonly id: StoreId;
    readonly name: string;
    readonly dateCreation: string;
    readonly externalId: string;
    readonly userId: MpUserId;
    readonly cashiers?: Cashier[];

    constructor({ id, name, dateCreation, externalId, userId, cashiers }: StoreProps) {
        this.id = id;
        this.name = name;
        this.dateCreation = dateCreation;
        this.externalId = externalId;
        this.userId = userId;
        this.cashiers = cashiers;
    }

    static new(props: StoreProps): Store {
        return new Store({
            ...props,
        });
    }

    copy(props: Partial<StoreProps>): Store {
        return new Store({
            ...this,
            ...props,
        });
    }

    static fromJson(data: StoreProps): Store {
        return new Store(data);
    }
}