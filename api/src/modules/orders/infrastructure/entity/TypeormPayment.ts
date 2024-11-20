import { Column, Entity, PrimaryGeneratedColumn, TableInheritance, JoinColumn, OneToOne, ChildEntity } from 'typeorm';
import { PaymentMethod, Payment, PaymentByMercadoPago, PaymentByCard, PaymentByCash } from '../../core/domain/Order';
import { TypeormOrder } from './TypeormOrder';

@Entity('payments')
@TableInheritance({ column: { type: 'enum', enum: PaymentMethod, name: 'method' } })
export abstract class TypeormPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @OneToOne(() => TypeormOrder, order => order.payment)
  @JoinColumn({ name: 'orderId' })
  order: TypeormOrder;

  abstract toDomain(): Payment;

  static fromDomain(payment: Payment): TypeormPayment {
    switch (payment.method) {
      case PaymentMethod.MERCADOPAGO:
        return TypeormPaymentByMercadoPago.fromDomain(payment as PaymentByMercadoPago);
      case PaymentMethod.CARD:
        return TypeormPaymentByCard.fromDomain(payment as PaymentByCard);
      case PaymentMethod.CASH:
        return TypeormPaymentByCash.fromDomain(payment as PaymentByCash);
      default:
        throw new Error('Unknown payment method');
    }
  }
}

@ChildEntity('mercadopago')
export class TypeormPaymentByMercadoPago extends TypeormPayment {
  @Column()
  operationId?: string;

  toDomain(): PaymentByMercadoPago {
    return {
      method: PaymentMethod.MERCADOPAGO,
      operationId: this.operationId,
      amount: this.amount,
    };
  }

  static fromDomain(payment: PaymentByMercadoPago): TypeormPaymentByMercadoPago {
    const paymentEntity = new TypeormPaymentByMercadoPago();
    paymentEntity.method = PaymentMethod.MERCADOPAGO;
    paymentEntity.operationId = payment.operationId;
    paymentEntity.amount = payment.amount;
    return paymentEntity;
  }
}

@ChildEntity('card')
export class TypeormPaymentByCard extends TypeormPayment {
  @Column()
  operationId?: string;

  toDomain(): PaymentByCard {
    return {
      method: PaymentMethod.CARD,
      operationId: this.operationId,
      amount: this.amount,
    };
  }

  static fromDomain(payment: PaymentByCard): TypeormPaymentByCard {
    const paymentEntity = new TypeormPaymentByCard();
    paymentEntity.method = PaymentMethod.CARD;  // Set the correct method
    paymentEntity.amount = payment.amount;
    paymentEntity.operationId = payment.operationId;
    return paymentEntity;
  }
}

@ChildEntity('cash')
export class TypeormPaymentByCash extends TypeormPayment {
  toDomain(): PaymentByCash {
    return {
      method: PaymentMethod.CASH,
      amount: this.amount,
    };
  }

  static fromDomain(payment: PaymentByCash): TypeormPaymentByCash {
    const paymentEntity = new TypeormPaymentByCash();
    paymentEntity.method = PaymentMethod.CASH;  // Set the correct method
    paymentEntity.amount = payment.amount;
    return paymentEntity;
  }
}
