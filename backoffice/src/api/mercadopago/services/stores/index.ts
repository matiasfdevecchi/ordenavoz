import useAuth from "../../../../auth/useAuth";
import useQuery from "../../../../hooks/useQuery";
import { MpUserId } from "../../types";
import { getMercadoPagoStores } from "./_queries";

const key = 'mercadopago-services/stores';

export const useGetMercadoPagoStores = (userId?: MpUserId) => {
    const { getAccessToken } = useAuth();

    return useQuery(
        [key, userId],
        async () => {
            const accessToken = await getAccessToken();
            return getMercadoPagoStores(accessToken, userId || 0);
        },
        {
            enabled: !!userId,
            staleTime: 0,
            cacheTime: 0,
            retry: false,
            refetchOnWindowFocus: false,
        }
    );
};