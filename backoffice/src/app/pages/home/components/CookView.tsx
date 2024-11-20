import { FC } from "react";
import { Order, OrderStatus } from "../../../../api/orders/Order";
import { getStatusColor, getStatusText } from "../../../../utils/order";
import { useUpdateOrder } from "../../../../api/orders";
import { useNotifier } from "../../../../hooks/useNotifier";
import ItemsTable from "./ItemsTable";

type Props = {
    order: Order;
}

const CookView: FC<Props> = ({ order }) => {
    const { notifySuccess } = useNotifier();
    const updateOrderAction = useUpdateOrder();

    const handleChangeStatus = (status: OrderStatus) => async () => {
        await updateOrderAction.mutateAsync({ id: order.id, status });
        notifySuccess('Orden marcada como lista');
    }

    return (
        <div className={`card border mb-4`} style={{ width: '100%', minHeight: '250px' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">Orden #{order.id}</h5>
                    {
                        order.status === OrderStatus.PREPARING && (
                            <button
                                type='button'
                                onClick={handleChangeStatus(OrderStatus.READY)}
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                            >
                                {
                                    updateOrderAction.isLoading
                                        ? <span className='spinner-border spinner-border-sm align-middle'></span>
                                        : <i className='fa fa-cutlery'></i>
                                }
                            </button>
                        )
                    }
                </div>
                <ItemsTable order={order} />
            </div>
        </div>
    );
}

export default CookView;
