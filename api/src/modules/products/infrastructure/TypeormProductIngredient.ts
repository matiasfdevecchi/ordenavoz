import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { TypeormProduct } from './TypeormProduct';
import { TypeormIngredient } from '../../ingredients/infrastructure/TypeormIngredient';
import { ProductId, ProductIngredient } from '../core/domain/Product';

@Entity('product_ingredients')
export class TypeormProductIngredient {
    @PrimaryColumn()
    productId: number;

    @PrimaryColumn()
    ingredientId: number;

    @ManyToOne(() => TypeormProduct, product => product.ingredients)
    product: TypeormProduct;

    @ManyToOne(() => TypeormIngredient, ingredient => ingredient.productIngredients)
    ingredient: TypeormIngredient;

    @Column()
    quantity: number;

    static from(productIngredient: ProductIngredient, id: ProductId): TypeormProductIngredient {
        const o = new TypeormProductIngredient();
        o.productId = id;
        o.ingredientId = productIngredient.ingredient.id;
        o.quantity = productIngredient.quantity;
        return o;
    }

    toDomain(): ProductIngredient {
        return {
            ingredient: this.ingredient?.toDomain() ?? { id: this.ingredientId },
            quantity: this.quantity,
        };
    }
}
