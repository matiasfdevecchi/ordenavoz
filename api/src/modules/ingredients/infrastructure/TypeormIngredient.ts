import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient, IngredientId } from '../core/domain/Ingredient';
import { TypeormProductIngredient } from '../../products/infrastructure/TypeormProductIngredient';
import { TypeormOrderItemVariantRemovedIngredient } from '../../orders/infrastructure/entity/TypeormOrderItemRemovedIngredient';

@Entity('ingredients')
export class TypeormIngredient {
  @PrimaryGeneratedColumn()
  id: IngredientId;

  @Column()
  name: string;
  
  @Column()
  image: string;

  @OneToMany(() => TypeormProductIngredient, productIngredient => productIngredient.ingredient)
  productIngredients: TypeormProductIngredient[];

  @OneToMany(() => TypeormOrderItemVariantRemovedIngredient, itemRemovedIngredient => itemRemovedIngredient.ingredient)
  itemRemovedIngredients: TypeormOrderItemVariantRemovedIngredient[];

  static from(ingredient: Ingredient): TypeormIngredient {
    const o = new TypeormIngredient();
    if (ingredient.id != 0) o.id = ingredient.id;
    o.name = ingredient.name;
    o.image = ingredient.image;
    return o;
  }

  toDomain(): Ingredient {
    return new Ingredient({
      id: this.id,
      name: this.name,
      image: this.image,
    });
  }
}
