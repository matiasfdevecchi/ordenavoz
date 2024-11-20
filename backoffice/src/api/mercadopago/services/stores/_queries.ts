import { HandledError } from "../../../utils/HandledError";
import { Store } from "../../stores/Store";
import { MpUserId } from "../../types";

export const getMercadoPagoStores = async (accessToken: string, userId: MpUserId): Promise<Store[]> => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago-services/${userId}/stores`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();

    return data.map(Store.fromJson);
}