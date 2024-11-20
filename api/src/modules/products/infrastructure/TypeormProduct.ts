import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product, ProductId } from '../core/domain/Product';
import { CategoryId } from '../../categories/core/domain/Category';
import { defaultPriceColumn, getDefaultPriceValue } from '../../shared/infrastructure/typeorm/types';
import { TypeormCategory } from '../../categories/infrastructure/TypeormCategory';
import { TypeormProductIngredient } from './TypeormProductIngredient';
import { TypeormOrderItem } from '../../orders/infrastructure/entity/TypeormOrderItem';

@Entity('products')
export class TypeormProduct {
  @PrimaryGeneratedColumn()
  id: ProductId;

  @Column()
  name: string;
  
  @Column()
  image: string;

  @Column()
  categoryId: CategoryId;

  @Column(defaultPriceColumn)
  price: number;

  @ManyToOne(() => TypeormCategory, category => category.products)
  category: TypeormCategory;

  @OneToMany(() => TypeormProductIngredient, productIngredient => productIngredient.product)
  ingredients: TypeormProductIngredient[];

  @OneToMany(() => TypeormOrderItem, orderItem => orderItem.product)
  orderItems: TypeormOrderItem[];
  

  static from(product: Product): TypeormProduct {
    const o = new TypeormProduct();
    if (product.id != 0) o.id = product.id;
    o.name = product.name;
    o.image = product.image;
    o.price = product.price;
    o.categoryId = product.category.id;
    return o;
  }

  toDomain(): Product {
    return new Product({
      id: this.id,
      name: this.name,
      image: this.image,
      price: getDefaultPriceValue(this.price),
      category: this.category?.toDomain() ?? { id: this.categoryId },
      ingredients: this.ingredients?.map(i => i.toDomain()) ?? [],
    });
  }

  toDomainWithIngredients(ingredients: TypeormProductIngredient[]): Product {
    return this.toDomain().copy({
      ingredients: ingredients.map(i => i.toDomain()),
    });
  }
}
