import { useQueryClient } from "react-query";
import useAuth from "../../auth/useAuth";
import useMutation from "../../hooks/useMutation";
import useQuery from "../../hooks/useQuery";
import { getWebConfig, updateWebConfig, UpdateWebConfigProps } from "./_queries";

const key = 'web-config';

export const useGetWebConfig = () => {
    const { getAccessToken } = useAuth();

    return useQuery(
        key,
        async () => getWebConfig(await getAccessToken()),
        {
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
        }
    );
}

export const useUpdateWebConfig = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(async (props: UpdateWebConfigProps) => updateWebConfig(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}