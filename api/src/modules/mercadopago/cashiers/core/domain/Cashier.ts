import { OptionalExceptFor } from "../../../../../utils/types";
import { Store } from "../../../stores/core/domain/Store";
import { MpUserId } from "../../../types";

export type CashierId = number;

export type CashierProps = {
    id: CashierId;
    name: string;
    dateCreation: string;
    externalId: string;
    store: OptionalExceptFor<Store, "id">;
}

export class Cashier {
    readonly id: CashierId;
    readonly name: string;
    readonly dateCreation: string;
    readonly externalId: string;
    readonly store: OptionalExceptFor<Store, "id">;

    constructor({ id, name, dateCreation, externalId, store }: CashierProps) {
        this.id = id;
        this.name = name;
        this.dateCreation = dateCreation;
        this.externalId = externalId;
        this.store = store;
    }

    static new(props: CashierProps): Cashier {
        return new Cashier({
            ...props,
        });
    }

    copy(props: Partial<CashierProps>): Cashier {
        return new Cashier({
            ...this,
            ...props,
        });
    }
}