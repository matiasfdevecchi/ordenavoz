import { useEffect, useState } from 'react';
import { Content } from '../../../../_metronic/layout/components/Content'
import { useGenerateMercadoPagoPointPaymentIntent, useGenerateMercadoPagoQR, useGetOrderById, usePayOrderByCardOrCash } from '../../../../api/orders';
import DefaultPage from '../../../../components/DefaultPage';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { OrderStatus, PaymentMethod } from '../../../../api/orders/Order';
import { useNotifier } from '../../../../hooks/useNotifier';
import { useGetCashiers } from '../../../../api/mercadopago/cashiers';
import Select, { SingleValue } from 'react-select';
import io, { Socket } from 'socket.io-client';
import useAuth from '../../../../auth/useAuth';
import MercadoPagoDevices from './components/MercadoPagoDevices';
import { Device } from '../../../../api/mercadopago/devices/Device';
import { useCancelPaymentIntent } from '../../../../api/mercadopago/devices';

const OrderPayPage = () => {
    const { getAccessToken } = useAuth();
    const { id } = useParams();
    const [checkedPaid, setCheckedPaid] = useState(false);
    const { data, isLoading } = useGetOrderById(!!id ? parseInt(id) : undefined);
    const payByCardOrCashAction = usePayOrderByCardOrCash();
    const generateMercadoPagoQRAction = useGenerateMercadoPagoQR();
    const generateMercadoPagoPointPaymentIntentAction = useGenerateMercadoPagoPointPaymentIntent();
    const cancelPaymentIntent = useCancelPaymentIntent();
    const { data: cashiers, isLoading: isLoadingCashiers } = useGetCashiers();
    const [isPaid, setIsPaid] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const previousLocationPathname: string | undefined = (location.state as any)?.previousLocationPathname;
    const { notifySuccess, notifyError } = useNotifier();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MERCADOPAGO);
    const [waitingPayment, setWaitingPayment] = useState(false);
    const [selectedCashier, setSelectedCashier] = useState<{ value: number; label: string } | undefined>(undefined);
    const [pointPayment, setPointPayment] = useState<{
        device: Device;
        paymentIntentId: string;
    }>();
    const [loadingPoint, setLoadingPoint] = useState<Device>();

    const isPayButtonEnabled = selectedPaymentMethod === PaymentMethod.CASH || selectedPaymentMethod === PaymentMethod.CARD;

    const goBackUrl = () => {
        if (previousLocationPathname) {
            return previousLocationPathname;
        } else {
            return '/orders';
        }
    }

    const goBack = () => {
        navigate(goBackUrl());
    }

    useEffect(() => {
        if (data === undefined || checkedPaid) return;
        setCheckedPaid(true);
        if (data.status !== OrderStatus.PAYMENT_PENDING) {
            notifySuccess(`La orden #${id} ya fue pagada`);
            goBack();
        }
    }, [data]);

    useEffect(() => {
        let socketInstance: typeof Socket | null = null;  // Variable local para gestionar la instancia del socket

        const connect = async () => {
            const token = await getAccessToken();
            socketInstance = io(import.meta.env.VITE_API_URL, {
                auth: {
                    token: token
                }
            });

            socketInstance.on('connect', () => {
                console.log('Conectado al servidor de Socket.IO');
                socketInstance?.emit('join-order', id);
            });

            socketInstance.on('paid-by-mercadopago', () => {
                notifySuccess('Pago realizado con éxito a través de Mercado Pago');
                setIsPaid(true);
                setWaitingPayment(false);
            });

            socketInstance.on('payment-canceled-by-mercadopago', () => {
                setWaitingPayment(false);
                notifySuccess('El pago fue cancelado');
            })

            socketInstance.on('disconnect', () => {
                console.log('Desconectado del servidor de Socket.IO');
            });
        };

        if (id) {
            connect();  // Solo conectamos si hay un ID
        }

        return () => {
            if (socketInstance) {
                socketInstance.removeAllListeners();  // Removemos los listeners
                socketInstance.disconnect();  // Desconectamos el socket
                console.log('Socket disconnected and listeners removed');
            }
        };
    }, [id, getAccessToken]);

    const handlePaymentMethodClick = (method: PaymentMethod) => {
        if (isPaid || waitingPayment) {
            return;
        }
        setSelectedPaymentMethod(method);
    };

    const getCardClasses = (method: PaymentMethod) => {
        return `nav-link btn btn-outline btn-flex btn-color-muted btn-active-color-primary flex-column overflow-hidden w-100 ${selectedPaymentMethod === method ? 'border-primary bg-light' : ''}`;
    };

    const handlePayWithQR = () => {
        if (selectedCashier) {
            setWaitingPayment(true);
            data && generateMercadoPagoQRAction.mutate({
                id: data.id,
                cashierId: selectedCashier.value
            });
        } else {
            alert('Por favor selecciona una caja antes de generar el QR.');
        }
    };

    const handleCancelQR = () => {
        setWaitingPayment(false);
    };

    const handleCancelPaymentIntent = async () => {
        if (pointPayment) {
            await cancelPaymentIntent.mutateAsync({
                paymentIntentId: pointPayment.paymentIntentId,
                deviceId: pointPayment.device.id
            });
            setWaitingPayment(false);
        }
    };

    const handleCreatePaymentIntent = async (device: Device) => {
        try {
            setLoadingPoint(device);
            if (!data) return;

            const paymentIntentId = await generateMercadoPagoPointPaymentIntentAction.mutateAsync({
                id: data.id,
                deviceId: device.id,
            });

            setPointPayment({
                device,
                paymentIntentId,
            })
            setWaitingPayment(true);
        } catch (error) {
            setWaitingPayment(false);
        } finally {
            setLoadingPoint(undefined);
        }
    }

    const handlePay = async () => {
        if (data === undefined || selectedPaymentMethod === PaymentMethod.MERCADOPAGO) {
            return;
        }

        const amount = data.total;

        await payByCardOrCashAction.mutateAsync({
            id: data.id,
            method: selectedPaymentMethod,
            amount
        });

        notifySuccess('Pago realizado con éxito');
        goBack();
    }

    const cashierOptions = cashiers?.map(cashier => ({
        value: cashier.id,
        label: cashier.name
    }));

    const handleCashierChange = (newValue: SingleValue<{ value: number; label: string }>) => {
        setSelectedCashier(newValue || undefined);
    };

    return (
        <Content>
            <DefaultPage
                title={`Pagar orden #${id}${data !== undefined ? ' - $' + data.total.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : ''}`}
                isLoading={isLoading || isLoadingCashiers}
            >
                <div className="mt-6 row">
                    <div className="col-4 mb-4">
                        <div
                            className={getCardClasses(PaymentMethod.MERCADOPAGO)}
                            id={`mercadopago`}
                            aria-selected={selectedPaymentMethod === PaymentMethod.MERCADOPAGO}
                            role="tab"
                            tabIndex={-1}
                            onClick={() => handlePaymentMethodClick(PaymentMethod.MERCADOPAGO)}
                        >
                            <div className="nav-icon me-3">
                                <img src='https://diamo.com.ar/files/mercadopago.png' alt='Mercado Pago' className="img-fluid" style={{ maxHeight: "100px" }} />
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-start h-100 p-4">
                                <span className={`nav-text fw-bold fs-3 lh-1 text-gray-800`}>
                                    Mercado Pago
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mb-4">
                        <div
                            className={getCardClasses(PaymentMethod.CASH)}
                            id={`cash`}
                            aria-selected={selectedPaymentMethod === PaymentMethod.CASH}
                            role="tab"
                            tabIndex={-1}
                            onClick={() => handlePaymentMethodClick(PaymentMethod.CASH)}
                        >
                            <div className="nav-icon me-3">
                                <img src='https://png.pngtree.com/png-vector/20191028/ourmid/pngtree-pack-cash-icon-cartoon-style-png-image_1893446.jpg' alt='Efectivo' className="img-fluid" style={{ maxHeight: "100px" }} />
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-start h-100 p-4">
                                <span className={`nav-text fw-bold fs-3 lh-1 text-gray-800`}>
                                    Efectivo
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mb-4">
                        <div
                            className={getCardClasses(PaymentMethod.CARD)}
                            id={`card`}
                            aria-selected={selectedPaymentMethod === PaymentMethod.CARD}
                            role="tab"
                            tabIndex={-1}
                            onClick={() => handlePaymentMethodClick(PaymentMethod.CARD)}
                        >
                            <div className="nav-icon me-3">
                                <img src='https://cdn-icons-png.flaticon.com/512/6963/6963703.png' alt='card' className="img-fluid" style={{ maxHeight: "100px" }} />
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-start h-100 p-4">
                                <span className={`nav-text fw-bold fs-3 lh-1 text-gray-800`}>
                                    Tarjetas de crédito / débito
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    selectedPaymentMethod === 'card' && <>
                        {
                            !isPaid && !waitingPayment && <MercadoPagoDevices handlePay={handleCreatePaymentIntent} loadingDevice={loadingPoint} />
                        }
                        {waitingPayment && (
                            <>
                                <div className="d-flex d-cols justify-content-center my-4 align-items-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Esperando pago...</span>
                                    </div>
                                    <span className="ms-2">Esperando pago...</span>
                                </div>
                                {waitingPayment && (
                                    <div className='text-center'>
                                        <button className="btn btn-danger mx-auto" onClick={handleCancelPaymentIntent} disabled={cancelPaymentIntent.isLoading}>
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        {
                            isPaid && <div className="alert alert-success mt-4" role="alert">
                                El pago fue realizado con éxito a través de Mercado Pago Point
                            </div>
                        }
                    </>
                }

                {
                    selectedPaymentMethod === 'mercadopago' && <>
                        {/* Select para elegir la caja y botón "Generar QR de Mercado Pago" */}
                        {
                            !isPaid && <div className="my-4 d-flex align-items-center justify-content-center">
                                <div className="flex-grow-1">
                                    <Select
                                        value={selectedCashier}
                                        onChange={handleCashierChange}
                                        options={cashierOptions}
                                        placeholder="Selecciona una caja"
                                        isLoading={isLoadingCashiers}
                                        isDisabled={waitingPayment}
                                    />
                                </div>

                                {!waitingPayment && (
                                    <button className="btn btn-success ms-3" onClick={handlePayWithQR}>
                                        Generar QR de Mercado Pago
                                    </button>
                                )}
                                {waitingPayment && (
                                    <button className="btn btn-danger ms-3" onClick={handleCancelQR}>
                                        Cancelar QR
                                    </button>
                                )}
                            </div>
                        }

                        {/* Loading "Esperando pago..." */}
                        {waitingPayment && (
                            <div className="d-flex justify-content-center my-4 align-items-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Esperando pago...</span>
                                </div>
                                <span className="ms-2">Esperando pago...</span>
                            </div>
                        )}
                        {
                            isPaid && <div className="alert alert-success mt-4" role="alert">
                                El pago fue realizado con éxito a través de Mercado Pago
                            </div>
                        }
                    </>
                }


            </DefaultPage>

            <div className="d-flex justify-content-end mt-6">
                {
                    (!waitingPayment || isPaid) && <Link to={goBackUrl()} id="kt_ecommerce_add_product_cancel" className="btn btn-light me-5">
                        Volver
                    </Link>
                }
                {
                    selectedPaymentMethod === 'cash' && <button type="submit" id="kt_ecommerce_add_product_submit" className="btn btn-primary" onClick={handlePay} disabled={!isPayButtonEnabled || payByCardOrCashAction.isLoading}>
                        <span className="indicator-label">Pagar</span>
                        {
                            payByCardOrCashAction.isLoading && <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        }
                    </button>
                }
            </div>
        </Content>
    )
}

export default OrderPayPage;

