import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category, CategoryId } from '../core/domain/Category';
import { TypeormProduct } from '../../products/infrastructure/TypeormProduct';

@Entity('categories')
export class TypeormCategory {
  @PrimaryGeneratedColumn()
  id: CategoryId;

  @Column()
  name: string;
  
  @Column()
  image: string;

  @OneToMany(() => TypeormProduct, product => product.category)
  products: TypeormProduct[];

  static from(category: Category): TypeormCategory {
    const o = new TypeormCategory();
    if (category.id != 0) o.id = category.id;
    o.name = category.name;
    o.image = category.image;
    return o;
  }

  toDomain(): Category {
    return new Category({
      id: this.id,
      name: this.name,
      image: this.image,
    });
  }
}
