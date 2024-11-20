import { FC, Fragment } from "react";
import { OrderItem, Variant } from "../../../../../api/orders/Order";

const getItemModifications = (variant: Variant) => {
    if (variant.removedIngredients.length === 0) return "Sin modificaciones"

    return variant.removedIngredients.map(i => `-${i.quantity} ${i.ingredient.name}`).join(",");
}

type Props = {
    items: OrderItem[];
    onRemove: (itemIndex: number, variantIndex: number) => void;
    onDecrease: (itemIndex: number, variantIndex: number) => void;
    onIncrease: (itemIndex: number, variantIndex: number) => void;
}

const ItemsTable: FC<Props> = ({ items, onRemove, onDecrease, onIncrease }) => {

    if (items.length === 0) {
        return <div className="card-px text-center pt-15 pb-15">
            <p className="text-gray-500 fs-4 fw-semibold py-7">
                No hay items seleccionados.
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
                        className={`ps-4 fs-5 min-w-125px text-center`}
                    >
                        Precio
                    </th>
                    <th className='min-w-50px text-end rounded-end'></th>
                </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
                {
                    items.map((item, index) => {
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
                                                <button
                                                    type="button"
                                                    className="btn btn-light btn-sm"
                                                    onClick={() => { onDecrease(index, vIndex) }}
                                                    disabled={variant.quantity <= 0}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-3">{variant.quantity}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-light btn-sm"
                                                    onClick={() => { onIncrease(index, vIndex) }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className='text-center'>
                                            ${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className='text-end'>
                                            <a
                                                onClick={(e) => { e.stopPropagation(); onRemove(index, vIndex); }}
                                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                                            >
                                                <i className='fa fa-trash'></i>
                                            </a>
                                        </td>
                                    </tr>
                                })
                            }
                        </Fragment>
                    })
                }
            </tbody>
            {/* end::Table body */}
        </table>
        {/* end::Table */}
    </div>
}

export default ItemsTable;