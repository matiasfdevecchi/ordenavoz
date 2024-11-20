import { MpUserId } from "../../types";
import { QRPaymentService } from "../core/domain/QRPaymentService";

export class ApiQRPaymentService implements QRPaymentService {
    async create(userId: MpUserId, reference: string, externalStoreId: string, externalCashierId: string, amount: number): Promise<void> {
        try {
            const response = await fetch(`https://api.mercadopago.com/instore/qr/seller/collectors/${userId}/stores/${externalStoreId}/pos/${externalCashierId}/orders`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cash_out: {
                        amount: 0
                    },
                    description: "Compra de Ordena Voz - Hamburguesería - Orden #" + reference,
                    external_reference: reference,
                    items: [
                        {
                            title: "Ordena Voz - Orden #" + reference,
                            description: "Compra de Ordena Voz - Hamburguesería - Orden #" + reference,
                            unit_price: amount,
                            quantity: 1,
                            unit_measure: "unit",
                            total_amount: amount
                        }
                    ],
                    title: "Ordena Voz - Orden #" + reference,
                    total_amount: amount
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create QR payment: ${response.statusText}`);
            }

            // La respuesta esperada es un 204 No Content, lo que indica éxito sin cuerpo en la respuesta
            if (response.status !== 204) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }

        } catch (error) {
            console.error('Failed to create QR payment', error);
            throw error;
        }
    }

    async createDynamic(userId: MpUserId, reference: string, externalCashierId: string, amount: number): Promise<string> {
        try {
            const response = await fetch(`https://api.mercadopago.com/instore/orders/qr/seller/collectors/${userId}/pos/${externalCashierId}/qrs`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cash_out: {
                        amount: 0
                    },
                    description: "Compra de Ordena Voz - Hamburguesería - Orden #" + reference,
                    external_reference: reference,
                    items: [
                        {
                            title: "Ordena Voz - Orden #" + reference,
                            description: "Compra de Ordena Voz - Hamburguesería - Orden #" + reference,
                            unit_price: amount,
                            quantity: 1,
                            unit_measure: "unit",
                            total_amount: amount
                        }
                    ],
                    title: "Ordena Voz - Orden #" + reference,
                    total_amount: amount
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create QR payment: ${response.statusText}`);
            }

            if (response.status !== 201) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }

            const data = await response.json() as { qr_data: string };
            return data.qr_data;
        } catch (error) {
            console.error('Failed to create QR payment', error);
            throw error;
        }
    }
}
