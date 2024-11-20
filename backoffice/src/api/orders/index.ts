import { useQueryClient } from "react-query";
import { createOrder, CreateOrderProps, generateMercadoPagoPointPaymentIntent, generateMercadoPagoQR, getOrderById, getOrders, payOrderByCardOrCash, updateOrder, UpdateOrderProps } from "./_queries";
import useAuth from "../../auth/useAuth";
import useMutation from "../../hooks/useMutation";
import useQuery from "../../hooks/useQuery";
import { Order, OrderId, OrderStatus, PaymentMethod } from "./Order";
import { DeviceId } from "../mercadopago/devices/Device";

const key = 'orders';

export const useCreateOrder = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: CreateOrderProps) => createOrder(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    const { getAccessToken } = useAuth();
    return useMutation(async ({ id, ...props }: { id: OrderId } & UpdateOrderProps) => updateOrder(await getAccessToken(), id, props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useGetOrders = (page: number, pageSize: number, status?: OrderStatus, sortOrder?: 'ASC' | 'DESC') => {
    const { getAccessToken } = useAuth();
    return useQuery([key, page, pageSize, status], async () => {
        return getOrders(await getAccessToken(), page, pageSize, status, sortOrder);
    }, {
        staleTime: 1 * 60 * 1000, // 1 minutos
        cacheTime: 2 * 60 * 1000, // 2 minutos
    });
}

export const useGetOrderById = (id: OrderId | undefined) => {
    const { getAccessToken } = useAuth();
    return useQuery([key, id], async () => getOrderById(await getAccessToken(), id || 0), {
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
        enabled: !!id, // Solo ejecuta la query si hay un ID
    });
};

export const usePayOrderByCardOrCash = () => {
    const queryClient = useQueryClient();
    const { getAccessToken } = useAuth();
    return useMutation(async (props: { id: OrderId, method: PaymentMethod, amount: number }) => {
        const { id, method, amount } = props;
        return payOrderByCardOrCash(await getAccessToken(), id, method, amount);
    }, {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useGenerateMercadoPagoQR = () => {
    const { getAccessToken } = useAuth();
    return useMutation(async (props: { id: OrderId, cashierId: number }) => {
        return generateMercadoPagoQR(await getAccessToken(), props.id, props.cashierId);
    });
}

export const useGenerateMercadoPagoPointPaymentIntent = () => {
    const { getAccessToken } = useAuth();
    return useMutation(async (props: { id: OrderId, deviceId: DeviceId }) => {
        return generateMercadoPagoPointPaymentIntent(await getAccessToken(), props.id, props.deviceId);
    });
}

export const useCreateOrderInCache = () => {
    const queryClient = useQueryClient();

    return (newOrder: Order) => {
        queryClient.setQueryData([key, newOrder.status], (oldOrders: any) => {
            if (Array.isArray(oldOrders)) {
                return [...oldOrders, newOrder];
            }
            return [newOrder];
        });

        queryClient.setQueryData([key, undefined], (oldOrders: any) => {
            if (Array.isArray(oldOrders)) {
                return [...oldOrders, newOrder];
            }
            return [newOrder];
        });
    };
};

export const useUpdateOrderInCache = () => {
    const queryClient = useQueryClient();

    return (updatedOrder: Order) => {
        queryClient.setQueriesData(
            [key],
            (oldOrders: any) => {
                if (Array.isArray(oldOrders)) {
                    return oldOrders.map((order) =>
                        order.id === updatedOrder.id ? updatedOrder : order
                    );
                }
                return [];
            }
        );

        queryClient.setQueriesData(
            [key, updatedOrder.status],
            (oldOrders: any) => {
                if (Array.isArray(oldOrders)) {
                    const existingOrder = oldOrders.find((order) => order.id === updatedOrder.id);
                    if (existingOrder) {
                        return oldOrders.map((order) =>
                            order.id === updatedOrder.id ? updatedOrder : order
                        );
                    } else {
                        return [...oldOrders, updatedOrder];
                    }
                }
                return [updatedOrder];
            }
        );

        const allStatuses = Object.values(OrderStatus);
        allStatuses.forEach((status) => {
            if (status !== updatedOrder.status) {
                queryClient.setQueriesData(
                    [key, status],
                    (oldOrders: any) => {
                        if (Array.isArray(oldOrders)) {
                            return oldOrders.filter((order) => order.id !== updatedOrder.id);
                        }
                        return [];
                    }
                );
            }
        });
    };
};

export const useDeleteOrderInCache = () => {
    const queryClient = useQueryClient();

    return (orderId: OrderId, currentStatus: OrderStatus) => {
        queryClient.setQueriesData(
            [key],
            (oldOrders: any) => {
                if (Array.isArray(oldOrders)) {
                    return oldOrders.filter((order) => order.id !== orderId);
                }
                return [];
            }
        );

        queryClient.setQueriesData(
            [key, currentStatus],
            (oldOrders: any) => {
                if (Array.isArray(oldOrders)) {
                    return oldOrders.filter((order) => order.id !== orderId);
                }
                return [];
            }
        );
    };
};

export const useInvalidateAllOrdersQueries = () => {
    const queryClient = useQueryClient();
    const allStatuses = Object.values(OrderStatus);

    return () => {
        queryClient.invalidateQueries([key]);
        queryClient.invalidateQueries([key, undefined]);
        allStatuses.forEach((status) => {
            queryClient.invalidateQueries([key, status]);
        });
    };
}