import { MercadoPagoConflict } from "../../errors/MercadoPagoConflict";
import { StoreId } from "../../stores/core/domain/Store";
import { Cashier, CashierId, CashierProps } from "../core/domain/Cashier";
import { CashierService } from "../core/domain/CashierService";

interface CashierApiResponse {
    id: number;
    name: string;
    date_created: string;
    external_id: string | undefined;
    external_store_id: string | undefined;
    user_id: number;
    store_id: string;
}

interface GetAllApiResponse {
    paging: {
        total: number;
        offset: number;
        limit: number;
    };
    results: Array<CashierApiResponse>;
}

export class ApiCashierService implements CashierService {

    async setExternalId(cashierId: CashierId, externalStoreId: string, externalId: string): Promise<void> {
        try {
            const response = await fetch(`https://api.mercadopago.com/pos/${cashierId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    external_id: externalId,
                    external_store_id: externalStoreId,
                }),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    throw new MercadoPagoConflict(cashierId);
                } else {
                    const data = await response.json() as { message: string };
                    if (data.message.includes('is already assigned to this user')) {
                        return;
                    }
                    throw new Error(`Error setting external_id: ${response.statusText}`);
                }
            }
        } catch (error) {
            console.error('Failed to set external_id', error);
            throw error;
        }
    }

    async getAll(storeId: StoreId): Promise<Cashier[]> {
        try {
            const response = await fetch(`https://api.mercadopago.com/pos?store_id=${storeId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching cashiers: ${response.statusText}`);
            }

            const data = await response.json() as GetAllApiResponse;

            const cashiers: Cashier[] = data.results.map((item) => {
                const cashierProps: CashierProps = {
                    id: item.id,
                    name: item.name,
                    dateCreation: item.date_created,
                    externalId: item.external_id || '',
                    store: {
                        id: item.store_id,
                        externalId: item.external_store_id || '',
                    },
                };
                return new Cashier(cashierProps);
            });

            return cashiers;
        } catch (error) {
            console.error('Failed to fetch cashiers', error);
            throw error;
        }
    }
}
