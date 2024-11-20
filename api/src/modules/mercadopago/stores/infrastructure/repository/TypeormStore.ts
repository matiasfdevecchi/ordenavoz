import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Store, StoreId } from '../../core/domain/Store';
import { MpUserId } from '../../../types';
import { TypeormCashier } from '../../../cashiers/infrastructure/repository/TypeormCashier';

@Entity('stores')
export class TypeormStore {
    @PrimaryColumn()
    id: StoreId;

    @Column()
    name: string;

    @Column()
    dateCreation: string;

    @Column()
    externalId: string;

    @Column()
    userId: MpUserId;

    @OneToMany(() => TypeormCashier, (cashier) => cashier.store)
    cashiers: TypeormCashier[];

    static from(store: Store): TypeormStore {
        const o = new TypeormStore();
        o.id = store.id;
        o.name = store.name;
        o.dateCreation = store.dateCreation;
        o.externalId = store.externalId;
        o.userId = store.userId;

        return o;
    }

    toDomain(): Store {
        return new Store({
            id: this.id,
            userId: this.userId,
            dateCreation: this.dateCreation,
            externalId: this.externalId,
            name: this.name,
            cashiers: this.cashiers?.map((cashier) => cashier.toDomain()),
        });
    }
}
