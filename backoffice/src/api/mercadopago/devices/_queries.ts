import { EntriesResult } from "../../../utils/EntriesResult";
import { HandledError } from "../../utils/HandledError";
import { Device, DeviceId, PaymentIntentId } from "./Device";

export const getDevices = async (accessToken: string, page: number, pageSize: number): Promise<EntriesResult<Device>> => {
    let query = `?page=${page}&pageSize=${pageSize}`;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/devices${query}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();

    return {
        ...data,
        entries: data.entries.map(Device.fromJson)
    }
}

export const cancelPaymentIntent = async (accessToken: string, deviceId: DeviceId, paymentIntentId: PaymentIntentId): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/mercadopago/devices/${deviceId}/payment-intents/${paymentIntentId}`, {
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