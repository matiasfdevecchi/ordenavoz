import { FC, Fragment } from "react";
import { Order, OrderItem, Variant } from "../../../../../api/orders/Order";

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

    return <div className='table-responsive'>
        {/* begin::Table */}
        <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
                <tr className='fw-bold text-muted bg-light'>
                    <th
                        className={`ps-4 fs-5 min-w-325px rounded-start text-start`}
                    >
                        Producto
                    </th>
                    <th
                        className={`ps-4 fs-5 min-w-125px text-center`}
                    >
                        Cantidad
                    </th>
                    <th
                        className={`px-4 fs-5 min-w-125px text-end rounded-end`}
                    >
                        Precio
                    </th>
                </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
                {
                    order.items.map((item, index) => {
                        return <Fragment key={index}>
                            {
                                item.variants.map((variant, vIndex) => {
                                    return <tr key={`${index}-${vIndex}`}>
                                        <td className='text-start'>
                                            <div className='d-flex align-items-center'>
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
                                            </div>
                                        </td>
                                        <td className='text-center'>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="mx-3">{variant.quantity}</span>
                                            </div>
                                        </td>
                                        <td className='text-end px-4'>
                                            ${getItemPrice(item).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                })
                            }
                        </Fragment>
                    })
                }
                <tr>
                    <td></td>
                    <td className='text-center fs-5 fw-bold'>Total</td>
                    <td className='px-4 text-end fs-5 fw-bold'>${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                </tr>
            </tbody>
            {/* end::Table body */}
        </table>
        {/* end::Table */}
    </div>
}

export default ItemsTable;