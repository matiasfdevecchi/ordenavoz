import { FC, useState } from 'react';
import { useGetDevices } from '../../../../../api/mercadopago/devices';
import { KTIcon } from '../../../../../_metronic/helpers';
import { Device } from '../../../../../api/mercadopago/devices/Device';
import { EntriesResult } from '../../../../../utils/EntriesResult';
import { Pagination } from '../../../../../utils/Pagination';
import Table from '../../../../../components/Table';
import CustomActions from './CustomActions';

type Props = {
    data: EntriesResult<Device>;
    pagination: Pagination;
    handlePay: (device: Device) => void;
    setPagination: (pagination: Pagination) => void;
    loadingDevice: Device | undefined;
};

const DevicesTable: FC<Props> = ({ data, pagination, setPagination, handlePay, loadingDevice }) => {
    return (
        <Table
            headers={['ID del Dispositivo', 'POS ID', 'ID de la Tienda', 'Modo de Operación']}
            data={data.entries.map((device) => {
                return {
                    values: {
                        'ID del Dispositivo': (
                            <div className='d-flex align-items-center'>
                                <div className='symbol symbol-50px me-5'>
                                    <span className='symbol-label bg-light-primary'>
                                        <KTIcon iconName='finance-calculator' className='fs-2x text-primary' />
                                    </span>
                                </div>
                                <div className='d-flex justify-content-start flex-column'>
                                    <span className='text-gray-900 fw-bold fs-4'>{device.id}</span>
                                </div>
                            </div>
                        ),
                        'POS ID': <span className='text-gray-600 fw-bold fs-4'>{device.posId}</span>,
                        'ID de la Tienda': <span className='text-gray-600 fw-bold fs-4'>{device.storeId}</span>,
                        'Modo de Operación': (
                            <span className='badge badge-light-primary fw-bolder me-auto px-4 py-3'>
                                {device.operatingMode === 'PDV' ? 'PDV' : 'Standalone'}
                            </span>
                        ),
                    },
                    customActions: <CustomActions device={device} handlePay={handlePay} loadingDevice={loadingDevice} />,
                };
            })}
            pagination={{
                boxQuantity: 5,
                current: pagination.page,
                total: Math.ceil(data.pagination.total / pagination.pageSize),
                goToPage: (page) => {
                    setPagination(pagination.withPage(page));
                },
            }}
        />
    );
};

type MercadoPagoDevicesProps = {
    handlePay: (device: Device) => void;
    loadingDevice: Device | undefined;
}

const MercadoPagoDevices: FC<MercadoPagoDevicesProps> = ({handlePay, loadingDevice}) => {
    const [pagination, setPagination] = useState<Pagination>(Pagination.default());
    const { data, isLoading } = useGetDevices(pagination.page, pagination.pageSize);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!data) {
        return <div>No se encontraron dispositivos.</div>;
    }

    return (
        <div className="mt-10">
            <DevicesTable
                data={data}
                pagination={pagination}
                setPagination={setPagination}
                handlePay={handlePay}
                loadingDevice={loadingDevice}
            />
        </div>
    );
};

export default MercadoPagoDevices;
