import { KTIcon } from '../../../_metronic/helpers';
import { Content } from '../../../_metronic/layout/components/Content';
import DefaultPage from '../../../components/DefaultPage';
import { Link, useLocation } from 'react-router-dom';
import { OrdersList } from './components/OrdersList';
import { useGetOrders, useInvalidateAllOrdersQueries } from '../../../api/orders';
import { OrderStatus } from '../../../api/orders/Order';
import io, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import useAuth from '../../../auth/useAuth';
import CookView from './components/CookView';  // Importa tu componente CookView

const HomePage = () => {
  const [showCookingView, setShowCookingView] = useState(false);
  const location = useLocation();
  const getPendingOrdersAction = useGetOrders(0, -1, OrderStatus.PAYMENT_PENDING);
  const getPreparingOrdersAction = useGetOrders(0, -1, OrderStatus.PREPARING);
  const getReadyOrdersAction = useGetOrders(0, -1, OrderStatus.READY);

  const invalidateAllOrdersQueries = useInvalidateAllOrdersQueries();

  const { getAccessToken } = useAuth();

  useEffect(() => {
    let socketInstance: typeof Socket | null = null;

    const connect = async () => {
      socketInstance = io(import.meta.env.VITE_API_URL, {
        auth: {
          token: await getAccessToken()
        }
      });

      socketInstance.on('connect', () => {
        console.log('Conectado al servidor de Socket.IO');
        socketInstance?.emit('join-orders');
      });

      socketInstance.on('order-created', () => {
        invalidateAllOrdersQueries();
      });

      socketInstance.on('order-updated', () => {
        invalidateAllOrdersQueries();
      });

      socketInstance.on('order-deleted', () => {
        invalidateAllOrdersQueries();
      });

      socketInstance.on('disconnect', () => {
        console.log('Desconectado del servidor de Socket.IO');
      });
    };

    connect();

    return () => {
      if (socketInstance) {
          socketInstance.removeAllListeners();  // Removemos los listeners
          socketInstance.disconnect();  // Desconectamos el socket
          console.log('Socket disconnected and listeners removed');
      }
  };
  }, []);

  return (
    <Content>
      <DefaultPage
        title='Órdenes'
        isLoading={getPendingOrdersAction.isLoading || getPreparingOrdersAction.isLoading || getReadyOrdersAction.isLoading}
        rightComponent={
          <>
            {
              !showCookingView && <Link to='/orders/new' className='btn btn-primary' state={{ previousLocationPathname: location.pathname }}>
                <KTIcon iconName='plus' className='fs-2' />
                Nueva orden
              </Link>
            }
            <button className='btn btn-outline btn-outline-primary ms-2' onClick={(e) => {
              setShowCookingView(!showCookingView);
              e.currentTarget.blur();
            }}>
              <span className="svg-icon svg-icon-primary text-primary me-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" version="1.1">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24" />
                    <rect fill="currentColor" opacity="0.3" x="5" y="20" width="14" height="2" rx="1" />
                    <path d="M5,12.8739825 C3.27477279,12.4299397 2,10.8638394 2,9 C2,6.790861 3.790861,5 6,5 C6.11332888,5 6.22555698,5.00471299 6.33649899,5.01395368 C7.15621908,2.67628292 9.38235111,1 12,1 C14.6176489,1 16.8437809,2.67628292 17.663501,5.01395368 C17.774443,5.00471299 17.8866711,5 18,5 C20.209139,5 22,6.790861 22,9 C22,10.8638394 20.7252272,12.4299397 19,12.8739825 L19,17 C19,17.5522847 18.5522847,18 18,18 L6,18 C5.44771525,18 5,17.5522847 5,17 L5,12.8739825 Z" fill="currentColor" />
                  </g>
                </svg>
              </span>
              {showCookingView ? 'Deshabilitar' : 'Habilitar'} vista cocina
            </button>
          </>
        }>
        {
          !showCookingView && <>
            <OrdersList title='Pago pendiente' className='' noCard orders={getPendingOrdersAction.data?.entries || []} />
            <div className="row mt-6">
              <div className="col-md-6">
                <OrdersList title='En preparación' className='' orders={getPreparingOrdersAction.data?.entries || []} />
              </div>
              <div className="col-md-6">
                <OrdersList title='Pedidos listos' className='' orders={getReadyOrdersAction.data?.entries || []} />
              </div>
            </div>
          </>
        }
        {
          showCookingView && (
            <div className="row mt-6">
              {getPreparingOrdersAction.data?.entries.map(order => (
                <div className="col-md-4 mb-4" key={order.id}>
                  <CookView order={order} />
                </div>
              ))}
            </div>
          )
        }
      </DefaultPage>
    </Content>
  );
}

export { HomePage };
