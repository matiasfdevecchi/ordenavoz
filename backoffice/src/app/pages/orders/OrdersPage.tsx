import { KTIcon } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/Content'
import { useGetOrders } from '../../../api/orders';
import DefaultPage from '../../../components/DefaultPage';
import { Link, useLocation } from 'react-router-dom';
import { OrdersTable } from './components/OrdersTable';
import { useState } from 'react';
import { Pagination } from '../../../utils/Pagination';

const OrdersPage = () => {
  const location = useLocation();
  const [pagination, setPagination] = useState<Pagination>(Pagination.default());
  const { data, isLoading } = useGetOrders(pagination.page, pagination.pageSize, undefined, 'DESC');
  

  return (
    <Content>
      <DefaultPage
        title='Órdenes'
        isLoading={isLoading}
        rightComponent={
          <Link to='/orders/new' className='btn btn-primary'  state={{ previousLocationPathname: location.pathname }}>
            <KTIcon iconName='plus' className='fs-2' />
            Nueva orden
          </Link>
        }>
        {
          data && <OrdersTable orders={data} pagination={pagination} setPagination={setPagination} />
        }
      </DefaultPage>
    </Content>
  )
}

export { OrdersPage }