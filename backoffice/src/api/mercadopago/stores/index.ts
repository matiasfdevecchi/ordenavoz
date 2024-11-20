import { useQueryClient } from "react-query";
import { createStore, CreateStoreProps, deleteStore, getStores } from "./_queries";
import useAuth from "../../../auth/useAuth";
import useMutation from "../../../hooks/useMutation";
import useQuery from "../../../hooks/useQuery";

export const key = 'mercadopago-stores';

export const useGetStores = () => {
    const { getAccessToken } = useAuth();

    return useQuery(
        [key],
        async () => {
            const accessToken = await getAccessToken();
            return getStores(accessToken);
        },
        {
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
        }
    );
};

export const useCreateStore = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: CreateStoreProps) => createStore(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useDeleteStore = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (storeId: string) => deleteStore(await getAccessToken(), storeId), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}