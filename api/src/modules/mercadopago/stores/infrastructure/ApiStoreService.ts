import { MercadoPagoForbidden } from "../../errors/MercadoPagoForbidden";
import { MpUserId } from "../../types";
import { Store, StoreProps } from "../core/domain/Store";
import { StoreService } from "../core/domain/StoreService";

interface StoreApiResponse {
    id: string;
    name: string;
    date_creation: string;
    external_id: string | undefined;
}

interface GetAllApiResponse {
    paging: {
        total: number;
        offset: number;
        limit: number;
    };
    results: Array<StoreApiResponse>;
}

export class ApiStoreService implements StoreService {
    async setExternalId(userId: MpUserId, storeId: string, externalId: string): Promise<void> {
        try {
            const response = await fetch(`https://api.mercadopago.com/users/${userId}/stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ external_id: externalId }),
            });

            if (!response.ok) {
                const data = await response.json() as { message: string };
                if (data.message.includes('is already assigned to this user')) {
                    return;
                }
                throw new Error(`Error setting external_id: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to set external_id', error);
            throw error;
        }
    }

    async getAll(userId: MpUserId): Promise<Store[]> {
        try {
            const response = await fetch(`https://api.mercadopago.com/users/${userId}/stores/search`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`, // Reemplaza con tu token de acceso
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new MercadoPagoForbidden(userId);
                } else {
                    throw new Error(`Error fetching stores: ${response.statusText}`);
                }
            }

            const data = await response.json() as GetAllApiResponse;

            // Transformar los resultados en instancias de Store
            const stores: Store[] = data.results.map((item: any) => {
                const storeProps: StoreProps = {
                    id: item.id,
                    name: item.name,
                    dateCreation: item.date_creation,
                    externalId: item.external_id,
                    userId,
                };
                return new Store(storeProps);
            });

            return stores;
        } catch (error) {
            console.error('Failed to fetch stores', error);
            throw error;
        }
    }
}
