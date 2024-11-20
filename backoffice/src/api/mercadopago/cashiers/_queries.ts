import { HandledError } from "../../utils/HandledError";
import { StoreId } from "../stores/Store";
import { Cashier, CashierId } from "./Cashier";

export const getCashiers = async (accessToken: string): Promise<Cashier[]> => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/cashiers`, {
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

export type CreateCashierProps = {
    storeId: StoreId;
    cashierId: CashierId;
    externalId: string;
}

export const createCashier = async (accessToken: string, props: CreateCashierProps): Promise<Cashier> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/cashiers`, {
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
    return Cashier.fromJson(data);
}

export const deleteCashier = async (accessToken: string, cashierId: CashierId): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/cashiers/${cashierId}`, {
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