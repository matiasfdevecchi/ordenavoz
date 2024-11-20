import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { defaultPriceColumn, getDefaultPriceValue } from '../../../shared/infrastructure/typeorm/types';
import { RemovedIngredient } from '../../core/domain/Order';
import { IngredientId } from '../../../ingredients/core/domain/Ingredient';
import { TypeormIngredient } from '../../../ingredients/infrastructure/TypeormIngredient';
import { TypeormOrderItemVariant } from './TypeormOrderItemVariant';

@Entity('order_item_variant_removed_ingredients')
export class TypeormOrderItemVariantRemovedIngredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ingredientId: IngredientId;

    @Column(defaultPriceColumn)
    quantity: number;

    @ManyToOne(() => TypeormIngredient, ingredient => ingredient.itemRemovedIngredients)
    ingredient: TypeormIngredient;

    @ManyToOne(() => TypeormOrderItemVariant, variant => variant.removedIngredients, { onDelete: 'CASCADE' })
    variant: TypeormOrderItemVariant;

    static from(removed: RemovedIngredient): TypeormOrderItemVariantRemovedIngredient {
        const o = new TypeormOrderItemVariantRemovedIngredient();

        o.ingredientId = removed.ingredient.id;
        o.quantity = removed.quantity;

        return o;
    }

    toDomain(): RemovedIngredient {
        return {
            ingredient: this.ingredient === undefined ? { id: this.ingredientId } : this.ingredient.toDomain(),
            quantity: getDefaultPriceValue(this.quantity),
        }
    }
}
