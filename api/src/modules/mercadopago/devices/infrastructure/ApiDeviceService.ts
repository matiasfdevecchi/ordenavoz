import { EntriesResult } from "../../../shared/domain/EntriesResult";
import { Device, DeviceId, OperatingMode } from "../core/domain/Device";
import { DeviceService, GetAllParams } from "../core/domain/DeviceService";
import { MercadoPagoDeviceForbidden } from "../core/domain/errors/MercadoPagoForbidden";
import { MercadoPagoIntentAlreadyProcessed } from "../core/domain/errors/MercadoPagoIntentAlreadyProcessed";
import { MercadoPagoIntentAlreadyQueued } from "../core/domain/errors/MercadoPagoIntentAlreadyQueued";
import { MercadoPagoIntentNotFound } from "../core/domain/errors/MercadoPagoIntentNotFound";
import { MercadoPagoInvalidAmount } from "../core/domain/errors/MercadoPagoInvalidAmount";
import { PaymentIntentId } from "../core/domain/PaymentIntent";

interface DeviceApiResponse {
    id: string;
    pos_id: number;
    store_id: string;
    external_pos_id: string;
    operating_mode: string;
}

interface GetAllApiResponse {
    paging: {
        total: number;
        offset: number;
        limit: number;
    };
    devices: Array<DeviceApiResponse>;
}

export class ApiDeviceService implements DeviceService {
    async createPaymentIntent(deviceId: DeviceId, amount: number, ticketNumber: string, externalReference: string): Promise<PaymentIntentId> {
        try {
            const response = await fetch(`https://api.mercadopago.com/point/integration-api/devices/${deviceId}/payment-intents`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount * 100,
                    additional_info: {
                        external_reference: externalReference,
                        print_on_terminal: true,
                        ticket_number: ticketNumber,
                    },
                }),
            });

            if (!response.ok) {
                const data = await response.json() as { message: string };
                if (response.status === 403) {
                    throw new MercadoPagoDeviceForbidden(deviceId);
                }
                if (data.message.includes("There is already a queued intent for the device")) {
                    throw new MercadoPagoIntentAlreadyQueued(deviceId);
                }
                if (data.message.includes("Must be greater than or equal to")) {
                    const min = parseInt(data.message.split(" ").pop() || "0") / 100;
                    throw new MercadoPagoInvalidAmount(min, amount);
                }
                throw new Error(`Error creating payment intent: ${response.statusText} - ${data.message}`);
            }

            const data = await response.json() as { id: string };
            return data.id;
        } catch (error) {
            console.error('Failed to create payment intent', error);
            throw error;
        }
    }

    async cancelPaymentIntent(deviceId: DeviceId, paymentIntentId: PaymentIntentId): Promise<void> {
        try {
            const response = await fetch(`https://api.mercadopago.com/point/integration-api/devices/${deviceId}/payment-intents/${paymentIntentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                },
            });

            if (!response.ok) {
                const data = await response.json() as { message: string };
                if (response.status === 403) {
                    throw new MercadoPagoDeviceForbidden(deviceId);
                }
                if (response.status === 404) {
                    throw new MercadoPagoIntentNotFound(deviceId, paymentIntentId);
                }
                if (data.message.includes("Verify if the intent is already being processed")) {
                    throw new MercadoPagoIntentAlreadyProcessed(deviceId, paymentIntentId);
                }
                throw new Error(`Error canceling payment intent: ${response.statusText} - ${data.message}`);
            }
        } catch (error) {
            console.error('Failed to cancel payment intent', error);
            throw error;
        }
    }

    async updateOperatingMode(id: DeviceId, mode: OperatingMode): Promise<void> {
        try {
            const response = await fetch(`https://api.mercadopago.com/point/integration-api/devices/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ operating_mode: mode }),
            });

            if (!response.ok) {
                const data = await response.json() as { message: string };
                throw new Error(`Error setting device operating mode: ${response.statusText} - ${data.message}`);
            }
        } catch (error) {
            console.error('Failed to set device operating mode', error);
            throw error;
        }
    }

    async getAll({ pagination }: GetAllParams): Promise<EntriesResult<Device>> {
        try {
            const response = await fetch(`https://api.mercadopago.com/point/integration-api/devices?offset=${pagination.skip()}&limit=${pagination.take()}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`, // Reemplaza con tu token de acceso
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching stores: ${response.statusText}`);
            }

            const data = await response.json() as GetAllApiResponse;

            // Transformar los resultados en instancias de Store
            const devices = data.devices.map((device) => new Device({
                id: device.id,
                posId: device.pos_id,
                storeId: device.store_id,
                externalPosId: device.external_pos_id,
                operatingMode: device.operating_mode as OperatingMode,
            }));

            return {
                entries: devices,
                pagination: {
                    total: data.paging.total,
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                },
            }
        } catch (error) {
            console.error('Failed to fetch stores', error);
            throw error;
        }
    }
}
