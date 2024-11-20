import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from '../../core/domain/Order';
import { TypeormOrderItemVariantRemovedIngredient } from './TypeormOrderItemRemovedIngredient';
import { TypeormOrderItem } from './TypeormOrderItem';

@Entity('order_item_variants')
export class TypeormOrderItemVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @OneToMany(() => TypeormOrderItemVariantRemovedIngredient, removed => removed.variant, { cascade: true })
    removedIngredients: TypeormOrderItemVariantRemovedIngredient[];

    @ManyToOne(() => TypeormOrderItem, item => item.variants, { onDelete: 'CASCADE' })
    orderItem: TypeormOrderItem;


    static from(variant: Variant, includeRelations: boolean): TypeormOrderItemVariant {
        const o = new TypeormOrderItemVariant();
        o.quantity = variant.quantity;

        if (includeRelations) {
            o.removedIngredients = variant.removedIngredients.map(removed =>
                TypeormOrderItemVariantRemovedIngredient.from(removed));
        }

        return o;
    }

    toDomain(): Variant {
        return {
            removedIngredients: this.removedIngredients?.map(i => i.toDomain()),
            quantity: this.quantity,
        }
    }
}
