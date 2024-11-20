import { HandledError } from "../../../utils/HandledError";
import { Cashier } from "../../cashiers/Cashier";
import { StoreId } from "../../stores/Store";

export const getMercadoPagoCashiers = async (accessToken: string, storeId: StoreId): Promise<Cashier[]> => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago-services/stores/${storeId}/cashiers`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();

    return data.map(Cashier.fromJson);
}