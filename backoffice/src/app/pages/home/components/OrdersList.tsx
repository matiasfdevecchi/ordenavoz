
import { FC, useState } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { Order, OrderStatus } from '../../../../api/orders/Order'
import { Link } from 'react-router-dom';
import { useUpdateOrder } from '../../../../api/orders';
import { useNotifier } from '../../../../hooks/useNotifier';
import CancelOrderModal from './CancelOrderModal';
import { getStatusColor } from '../../../../utils/order';

const Item: FC<{
    order: Order;
}> = ({ order }) => {
    const { notifySuccess } = useNotifier();
    const updateOrderAction = useUpdateOrder();
    const cancelOrderAction = useUpdateOrder();
    const [openCancel, setOpenCancel] = useState(false);

    const handleChangeStatus = (status: OrderStatus) => async () => {
        await updateOrderAction.mutateAsync({ id: order.id, status });
        notifySuccess(`Orden #${order.id} ${status === OrderStatus.READY ? 'lista' : 'entregada'}`);
    }

    const handleCancelOrder = async () => {
        await cancelOrderAction.mutateAsync({ id: order.id, status: OrderStatus.CANCELED });
        notifySuccess(`Orden #${order.id} cancelada`);
    }

    return <>
        {
            openCancel && <CancelOrderModal
                order={order}
                onClose={() => { setOpenCancel(false) }}
                onCancel={handleCancelOrder}
                loading={cancelOrderAction.isLoading} />
        }
        <div className='d-flex justify-content-between align-items-center mb-7'>
            <div className='d-flex'>
                {/* begin::Symbol */}
                <div className='symbol symbol-50px me-5'>
                    <span className={`symbol-label bg-light-${getStatusColor(order.status)}`}>
                        <KTIcon iconName='cheque' className={`fs-2x text-${getStatusColor(order.status)}`} />
                    </span>
                </div>
                {/* end::Symbol */}
                {/* begin::Text */}
                <div className='d-flex flex-column'>
                    <Link to={`/orders/${order.id}`} className='text-gray-900 text-hover-primary fs-4 fw-bold'>
                        Orden #{order.id}
                    </Link>
                    <span className='text-muted fw-semibold'>{order.productsQuantity} producto{order.productsQuantity === 1 ? '' : 's'}</span>
                </div>
                {/* end::Text */}
            </div>
            <div>
                <Link
                    to={`/orders/${order.id}`}
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                    data-kt-menu-flip='top-end'
                >
                    <i className='fa fa-eye'></i>
                </Link>
                {
                    order.status === OrderStatus.PAYMENT_PENDING && <Link
                        to={`/orders/${order.id}/pay`}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-3'
                        state={{ previousLocationPathname: location.pathname }}
                    >
                        <i className='fa fa-usd'></i>
                    </Link>
                }
                {
                    order.status === OrderStatus.PREPARING && <button
                        type='button'
                        onClick={handleChangeStatus(OrderStatus.READY)}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-3'
                    >
                        {
                            updateOrderAction.isLoading
                                ? <span className='spinner-border spinner-border-sm align-middle'></span>
                                : <i className='fa fa-cutlery'></i>
                        }
                    </button>
                }
                {
                    order.status === OrderStatus.READY && <button
                        onClick={handleChangeStatus(OrderStatus.COMPLETED)}
                        disabled={updateOrderAction.isLoading}
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-3'
                    >
                        {
                            updateOrderAction.isLoading
                                ? <span className='spinner-border spinner-border-sm align-middle'></span>
                                : <i className='fa fa-check'></i>
                        }
                    </button>
                }
                <button
                    onClick={() => { setOpenCancel(true) }}
                    disabled={cancelOrderAction.isLoading}
                    className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm ms-3'
                >
                    {
                        cancelOrderAction.isLoading
                            ? <span className='spinner-border spinner-border-sm align-middle'></span>
                            : <i className='fa fa-ban'></i>
                    }
                </button>
            </div>
        </div>
    </>
}

type Props = {
    title: string;
    className: string;
    noCard?: boolean;
    orders: Order[];
}

const OrdersList: FC<Props> = ({ title, className, noCard = false, orders }) => {
    return (
        <div className={`${noCard ? '' : 'card'} ${className}`}>
            {/* begin::Header */}
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold text-gray-900'>{title}</span>
                    <span className='text-muted mt-1 fw-semibold fs-7'>{orders.length} órden{orders.length === 1 ? '': 'es'} pendiente{orders.length === 1 ? '': 's'}</span>
                </h3>
            </div>
            {/* end::Header */}

            {/* begin::Body */}
            <div className='card-body pt-5'>
                {
                    orders.map(order => <Item key={order.id} order={order} />)
                }
            </div>
            {/* end::Body */}
        </div>
    )
}

export { OrdersList }
