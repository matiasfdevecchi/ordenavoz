
import { FC } from 'react'
import { Order } from '../../../../api/orders/Order'
import Table from '../../../../components/Table';
import { Link } from 'react-router-dom';
import { getStatusColor, getStatusText } from '../../../../utils/order';
import { KTIcon } from '../../../../_metronic/helpers';
import { formatDateAndTime } from '../../../../utils/date';
import CustomActions from './CustomActions';
import { EntriesResult } from '../../../../utils/EntriesResult';
import { Pagination } from '../../../../utils/Pagination';

type Props = {
    orders: EntriesResult<Order>;
    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;
}

const OrdersTable: FC<Props> = ({ orders, pagination, setPagination }) => {

    return (<Table headers={['Orden', 'Estado', 'Productos', 'Precio']} data={orders.entries.map((order) => {
        return {
            values: {
                'Orden': <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                        <span className={`symbol-label bg-light-${getStatusColor(order.status)}`}>
                            <KTIcon iconName='cheque' className={`fs-2x text-${getStatusColor(order.status)}`} />
                        </span>
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                        <Link to={`/orders/${order.id}`} className='text-gray-900 fw-bold text-hover-primary mb-1 fs-4'>
                            Orden #{order.id}
                        </Link>
                        <span className='text-muted fw-semibold'>{formatDateAndTime(order.dateCreated)}</span>
                    </div>
                </div>,
                'Estado': <span className={`badge badge-light-${getStatusColor(order.status)} fw-bolder me-auto px-4 py-3`}>
                    {getStatusText(order.status)}
                </span>,
                'Productos': <span className='text-gray-600 fw-bold fs-4'>{order.productsQuantity}</span>,
                'Precio': <span className='text-gray-600 fw-bold fs-4'>${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>,
            },
            customActions: <CustomActions order={order} />,
        };
    })}
    pagination={{
        boxQuantity: 5,
        current: pagination.page,
        total: Math.ceil(orders.pagination.total / pagination.pageSize),
        goToPage: (page) => {
            setPagination(pagination.withPage(page));
        },
    }} />
    )
}

export { OrdersTable }
