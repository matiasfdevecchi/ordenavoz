import { FC, Fragment } from "react";
import { Order, OrderItem, Variant } from "../../../../api/orders/Order";
import Table from "../../../../components/Table";

const getItemModifications = (variant: Variant) => {
    if (variant.removedIngredients.length === 0) return "Sin modificaciones"

    return variant.removedIngredients.map(i => `-${i.quantity} ${i.ingredient.name}`).join(",");
}

type Props = {
    order: Order;
}

const getItemPrice = (item: OrderItem) => {
    return item.variants.reduce((acc, variant) => acc + variant.quantity * item.price, 0);
}

const ItemsTable: FC<Props> = ({ order }) => {

    if (order.items.length === 0) {
        return <div className="card-px text-center pt-15 pb-15">
            <p className="text-gray-500 fs-4 fw-semibold py-7">
                No hay items en la orden.
            </p>
        </div>
    }

    return <Table
        headers={['Producto', 'Cantidad']}
        data={order.items.flatMap((item, index) => {
            return item.variants.map((variant, vIndex) => {
                return {
                    values: {
                        'Producto': <div className='d-flex align-items-center'>
                            <div className='symbol symbol-50px me-5'>
                                <img
                                    src={item.product.image}
                                    className=''
                                    alt={item.product.name}
                                />
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                                <div className="fw-bold">{item.product.name}</div>
                                <div className="text-muted">{getItemModifications(variant)}</div>
                            </div>
                        </div>,
                        'Cantidad': <span className="mx-3">{variant.quantity}</span>
                    }
                }
            })
        })} />
}

export default ItemsTable;