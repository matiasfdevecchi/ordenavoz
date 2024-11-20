import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Cashier, CashierId } from '../../core/domain/Cashier';
import { MpUserId } from '../../../types';
import { StoreId } from '../../../stores/core/domain/Store';
import { TypeormStore } from '../../../stores/infrastructure/repository/TypeormStore';

@Entity('cashiers')
export class TypeormCashier {
    @PrimaryColumn()
    id: CashierId;

    @Column()
    storeId: StoreId;

    @Column()
    dateCreation: string;

    @Column()
    externalId: string;

    @Column()
    name: string;

    @ManyToOne(() => TypeormStore, (store) => store.cashiers)
    store: TypeormStore;

    static from(cashier: Cashier): TypeormCashier {
        const o = new TypeormCashier();
        o.id = cashier.id;
        o.storeId = cashier.store.id;
        o.dateCreation = cashier.dateCreation;
        o.externalId = cashier.externalId;
        o.name = cashier.name;
        return o;
    }

    toDomain(): Cashier {
        return new Cashier({
            id: this.id,
            store: this.store?.toDomain() ?? { id: this.storeId },
            dateCreation: this.dateCreation,
            externalId: this.externalId,
            name: this.name,
        });
    }
}
