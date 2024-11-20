import { HandledError } from "../../utils/HandledError";
import { MpUserId } from "../types";
import { Store, StoreId } from "./Store";

export const getStores = async (accessToken: string): Promise<Store[]> => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/stores`, {
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

export type CreateStoreProps = {
    mpUserId: MpUserId;
    storeId: StoreId;
    externalId: string;
}

export const createStore = async (accessToken: string, props: CreateStoreProps): Promise<Store> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/stores`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(props)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return Store.fromJson(data);
}

export const deleteStore = async (accessToken: string, storeId: StoreId): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/stores/${storeId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }
}