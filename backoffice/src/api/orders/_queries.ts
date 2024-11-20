import { EntriesResult } from "../../utils/EntriesResult";
import { CashierId } from "../mercadopago/cashiers/Cashier";
import { DeviceId, PaymentIntentId } from "../mercadopago/devices/Device";
import { HandledError } from "../utils/HandledError";
import { Order, OrderId, OrderStatus, PaymentMethod } from "./Order"

export const getOrders = async (accessToken: string, page: number, pageSize: number, status?: OrderStatus, sortOrder?: 'ASC' | 'DESC'): Promise<EntriesResult<Order>> => {
    let query = `?page=${page}&pageSize=${pageSize}`;
    if (status) query += `&status=${status}`;
    if (sortOrder) query += `&sortOrder=${sortOrder}`;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders${query}`, {
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
        entries: data.entries.map(Order.fromJson)
    }
}

export type CreateOrderProps = {
    items: Order['items'];
};

export const createOrder = async (accessToken: string, props: CreateOrderProps): Promise<Order> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
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
    return Order.fromJson(data);
}

export type UpdateOrderProps = {
    status: Order['status'];
};

export const updateOrder = async (accessToken: string, id: OrderId, props: Partial<UpdateOrderProps>): Promise<Order> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        method: "PATCH",
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
    return Order.fromJson(data);
}

export const payOrderByCardOrCash = async (accessToken: string, id: OrderId, method: PaymentMethod, amount: number): Promise<Order> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}/pay`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            method,
            amount
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return Order.fromJson(data);
}

export const generateMercadoPagoQR = async (accessToken: string, id: OrderId, cashierId: CashierId): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}/pay-mercadopago-qr`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cashierId,
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    return;
}

export const generateMercadoPagoPointPaymentIntent = async (accessToken: string, id: OrderId, deviceId: DeviceId): Promise<PaymentIntentId> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}/pay-mercadopago-point`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            deviceId,
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }
    
    const data = await response.json();
    return data.id;
}

export const getOrderById = async (accessToken: string, id: OrderId): Promise<Order> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return Order.fromJson(data);
}