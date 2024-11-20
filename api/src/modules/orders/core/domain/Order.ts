import { OptionalExceptFor } from "../../../../utils/types";
import { Ingredient } from "../../../ingredients/core/domain/Ingredient";
import { ProductProps } from "../../../products/core/domain/Product";

export type OrderId = number;

export enum OrderStatus {
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PREPARING = "PREPARING",
  READY = "READY",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export type RemovedIngredient = {
  ingredient: OptionalExceptFor<Ingredient, "id">;
  quantity: number;
}

export type Variant = {
  removedIngredients: RemovedIngredient[];
  quantity: number;
}

export type OrderItem = {
  product: OptionalExceptFor<ProductProps, "id">;
  price: number;
  variants: Variant[];
}

export enum PaymentMethod {
  MERCADOPAGO = "mercadopago",
  CARD = "card",
  CASH = "cash",
}

export type PaymentByMercadoPago = {
  method: PaymentMethod.MERCADOPAGO;
  operationId: string | undefined;
  amount: number;
}

export type PaymentByCard = {
  method: PaymentMethod.CARD;
  operationId: string | undefined;
  amount: number;
}

export type PaymentByCash = {
  method: PaymentMethod.CASH;
  amount: number;
}

export type Payment = PaymentByMercadoPago | PaymentByCard | PaymentByCash;

export type OrderProps = {
  id: OrderId;
  dateCreated: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  payment: Payment | undefined;
}

export class Order {
  readonly id: OrderId;
  readonly dateCreated: Date;
  readonly status: OrderStatus;
  readonly items: OrderItem[];
  readonly total: number;
  readonly payment: Payment | undefined;

  constructor({ id, dateCreated, status, items, total, payment }: OrderProps) {
    this.id = id;
    this.dateCreated = dateCreated;
    this.status = status;
    this.items = items;
    this.total = total;
    this.payment = payment;
  }

  static NEW_ID = 0;

  static new(props: Omit<OrderProps, "id">): Order {
    return new Order({
      ...props,
      id: this.NEW_ID,
    });
  }

  copy(props: Partial<OrderProps>): Order {
    return new Order({
      ...this,
      ...props,
    });
  }
}