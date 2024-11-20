import { FC, useState } from "react";
import { Order, OrderStatus } from "../../../../api/orders/Order";
import { Link } from "react-router-dom";
import { useUpdateOrder } from "../../../../api/orders";
import { useNotifier } from "../../../../hooks/useNotifier";
import CancelOrderModal from "../../home/components/CancelOrderModal";

type Props = {
    order: Order;
}

const CustomActions: FC<Props> = ({ order }) => {
    const [openCancel, setOpenCancel] = useState(false);

    const { notifySuccess } = useNotifier();

    const updateOrderAction = useUpdateOrder();
    const cancelOrderAction = useUpdateOrder();

    const handleChangeStatus = (status: OrderStatus) => async () => {
        await updateOrderAction.mutateAsync({ id: order.id, status });
        notifySuccess(`Orden #${order.id} ${status === OrderStatus.READY ? 'lista' : 'entregada'}`);
    }

    const handleCancelOrder = async () => {
        await cancelOrderAction.mutateAsync({ id: order.id, status: OrderStatus.CANCELED });
        notifySuccess(`Ordern #${order.id} cancelada`);
        setOpenCancel(false);
    }

    return <div>
        {
            openCancel && <CancelOrderModal
                order={order}
                onClose={() => { setOpenCancel(false) }}
                onCancel={handleCancelOrder}
                loading={cancelOrderAction.isLoading} />
        }
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
    </div>;
}

export default CustomActions;