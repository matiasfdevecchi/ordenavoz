import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { TypeormOrder } from './TypeormOrder';
import { ProductId } from '../../../products/core/domain/Product';
import { defaultPriceColumn, getDefaultPriceValue } from '../../../shared/infrastructure/typeorm/types';
import { OrderId, OrderItem } from '../../core/domain/Order';
import { TypeormProduct } from '../../../products/infrastructure/TypeormProduct';
import { TypeormOrderItemVariant } from './TypeormOrderItemVariant';

@Entity('order_items')
export class TypeormOrderItem {
    @PrimaryColumn({ generated: 'increment' })
    id: number;

    @Column()
    orderId: OrderId;

    @Column()
    productId: ProductId;

    @Column(defaultPriceColumn)
    price: number;

    @ManyToOne(() => TypeormProduct, product => product.orderItems)
    product: TypeormProduct;

    @ManyToOne(() => TypeormOrder, order => order.items, { onDelete: 'CASCADE' })
    order: TypeormOrder;

    @OneToMany(() => TypeormOrderItemVariant, variant => variant.orderItem, { cascade: true })
    variants: TypeormOrderItemVariant[];

    static from(item: OrderItem, includeRelations: boolean): TypeormOrderItem {
        const o = new TypeormOrderItem();
        o.productId = item.product.id;
        o.price = item.price;

        if (includeRelations) {
            o.variants = item.variants.map(variant => TypeormOrderItemVariant.from(variant, includeRelations));
        }

        return o;
    }

    toDomain(): OrderItem {
        return {
            product: this.product === undefined ? { id: this.productId } : this.product.toDomain(),
            price: getDefaultPriceValue(this.price),
            variants: this.variants?.map(i => i.toDomain()) ?? [],
        }
    }
}
