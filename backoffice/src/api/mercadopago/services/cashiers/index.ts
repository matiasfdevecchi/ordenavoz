import useAuth from "../../../../auth/useAuth";
import useQuery from "../../../../hooks/useQuery";
import { StoreId } from "../../stores/Store";
import { getMercadoPagoCashiers } from "./_queries";

const key = 'mercadopago-services/cashiers';

export const useGetMercadoPagoCashiers = (storeId?: StoreId) => {
    const { getAccessToken } = useAuth();

    return useQuery(
        [key, storeId],
        async () => {
            const accessToken = await getAccessToken();
            return getMercadoPagoCashiers(accessToken, storeId || '');
        },
        {
            enabled: !!storeId,
            staleTime: 0,
            cacheTime: 0,
            retry: false,
            refetchOnWindowFocus: false,
        }
    );
};