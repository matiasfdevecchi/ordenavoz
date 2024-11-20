import useAuth from "../../../auth/useAuth";
import useQuery from "../../../hooks/useQuery";
import { cancelPaymentIntent, getDevices } from "./_queries";
import useMutation from "../../../hooks/useMutation";
import { DeviceId, PaymentIntentId } from "./Device";

const key = 'devices';

export const useGetDevices = (page: number, pageSize: number) => {
    const { getAccessToken } = useAuth();
    return useQuery([key, page, pageSize], async () => {
        return getDevices(await getAccessToken(), page, pageSize);
    }, {
        staleTime: 1 * 60 * 1000, // 1 minutos
        cacheTime: 2 * 60 * 1000, // 2 minutos
    });
}

export const useCancelPaymentIntent = () => {
    const { getAccessToken } = useAuth();
    return useMutation(async (props: { deviceId: DeviceId, paymentIntentId: PaymentIntentId }) => {
        const { deviceId, paymentIntentId } = props;
        return cancelPaymentIntent(await getAccessToken(), deviceId, paymentIntentId);
    });
}