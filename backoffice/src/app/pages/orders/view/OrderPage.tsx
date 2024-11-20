import { Link, useLocation, useParams } from "react-router-dom";
import DefaultPage from "../../../../components/DefaultPage";
import { Content } from "../../../../_metronic/layout/components/Content";
import { useGetOrderById, useUpdateOrder } from "../../../../api/orders";
import ItemsTable from "./components/ItemsTable";
import { getStatusColor, getStatusText } from "../../../../utils/order";
import { OrderStatus } from "../../../../api/orders/Order";
import { useNotifier } from "../../../../hooks/useNotifier";

const OrderPage = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetOrderById(!!id ? parseInt(id) : undefined);
    const { notifySuccess } = useNotifier();
    const location = useLocation();

    const updateOrderAction = useUpdateOrder();
    const cancelOrderAction = useUpdateOrder();

    const handleChangeStatus = (status: OrderStatus) => async () => {
        if (!data) return;
        await updateOrderAction.mutateAsync({ id: data.id, status });
        notifySuccess('Estado actualizado');
    }

    const handleCancelOrder = async () => {
        if (!data) return;
        await cancelOrderAction.mutateAsync({ id: data.id, status: OrderStatus.CANCELED });
        notifySuccess('Orden cancelada');
    }

    return (
        <Content>
            <DefaultPage
                title={`Orden #${id}`}
                titleComponent={
                    data && <span className={`badge badge-light-${getStatusColor(data.status)} fw-bolder me-auto px-4 py-3`}>
                        {getStatusText(data.status)}
                    </span>
                }
                isLoading={isLoading}
                rightComponent={
                    data && <>
                        {
                            data.status === OrderStatus.PAYMENT_PENDING && <Link
                                state={{ previousLocationPathname: location.pathname }}
                                to={`/orders/${id}/pay`}
                                className="btn btn-primary">Pagar</Link>
                        }
                        {
                            data.status === OrderStatus.PREPARING && <button disabled={updateOrderAction.isLoading} className='btn btn-primary' onClick={handleChangeStatus(OrderStatus.READY)}>
                                Listo
                                {
                                    updateOrderAction.isLoading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                }
                            </button>
                        }
                        {
                            data.status === OrderStatus.READY && <button disabled={updateOrderAction.isLoading} className='btn btn-primary' onClick={handleChangeStatus(OrderStatus.COMPLETED)}>
                                Entregar
                                {
                                    updateOrderAction.isLoading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                }
                            </button>
                        }
                        {
                            data.status !== OrderStatus.CANCELED && <button disabled={cancelOrderAction.isLoading} className="btn btn-outline btn-outline-danger btn-active-light-danger ms-4" onClick={handleCancelOrder}>
                                Cancelar
                                {
                                    cancelOrderAction.isLoading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                }
                            </button>
                        }
                    </>
                }
            >
                {
                    data && <>
                        <ItemsTable order={data} />
                    </>
                }
            </DefaultPage>
        </Content>
    );
}

export default OrderPage;