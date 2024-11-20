import { useQueryClient } from "react-query";
import { createCashier, CreateCashierProps, deleteCashier, getCashiers } from "./_queries";
import useAuth from "../../../auth/useAuth";
import useMutation from "../../../hooks/useMutation";
import useQuery from "../../../hooks/useQuery";
import { CashierId } from "./Cashier";
import { key as storeKey } from '../stores';

const key = 'mercadopago-cashiers';

export const useGetCashiers = () => {
    const { getAccessToken } = useAuth();

    return useQuery(
        [key],
        async () => {
            const accessToken = await getAccessToken();
            return getCashiers(accessToken);
        },
        {
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
        }
    );
};

export const useCreateCashier = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: CreateCashierProps) => createCashier(await getAccessToken(), props), {
        onSuccess: () => {
            queryClient.invalidateQueries(key);
            queryClient.invalidateQueries(storeKey);
        }
    });
}

export const useDeleteCashier = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (cashierId: CashierId) => deleteCashier(await getAccessToken(), cashierId), {
        onSuccess: () => {
            queryClient.invalidateQueries(key);
            queryClient.invalidateQueries(storeKey);
        }
    });
}