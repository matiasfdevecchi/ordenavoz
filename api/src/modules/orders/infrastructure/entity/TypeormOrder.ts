import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Order, OrderId, OrderStatus } from '../../core/domain/Order';
import { TypeormOrderItem } from './TypeormOrderItem';
import { TypeormPayment } from './TypeormPayment';

@Entity('orders')
export class TypeormOrder {
  @PrimaryGeneratedColumn()
  id: OrderId;

  @Column("timestamp with time zone")
  dateCreated: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => TypeormOrderItem, orderItem => orderItem.order, { cascade: true })
  items: TypeormOrderItem[];

  @OneToOne(() => TypeormPayment, payment => payment.order, { cascade: true, nullable: true })
  @JoinColumn({ name: 'paymentId' })
  payment?: TypeormPayment;

  static from(order: Order, includeItemRelations: boolean, includePaymentRelations: boolean): TypeormOrder {
    const o = new TypeormOrder();

    if (order.id != 0) o.id = order.id;
    o.dateCreated = order.dateCreated.toISOString();
    o.status = order.status;
    o.total = order.total;

    if (includeItemRelations) {
      o.items = order.items?.map(item => TypeormOrderItem.from(item, includeItemRelations)) ?? [];
    }
    
    if (includePaymentRelations) {
      o.payment = order.payment ? TypeormPayment.fromDomain(order.payment) : undefined;
    }

    return o;
  }

  toDomain(): Order {
    return new Order({
      id: this.id,
      dateCreated: new Date(this.dateCreated),
      status: this.status,
      total: parseFloat(this.total.toString()),
      items: this.items?.map(i => i.toDomain()) ?? [],
      payment: this.payment ? this.payment.toDomain() : undefined,
    });
  }
}