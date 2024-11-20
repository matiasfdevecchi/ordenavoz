import { useQueryClient } from "react-query";
import { createIngredient, CreateIngredientProps, deleteIngredient, getIngredients, updateIngredient, UpdateIngredientProps } from "./_queries";
import useAuth from "../../auth/useAuth";
import useQuery from "../../hooks/useQuery";
import useMutation from "../../hooks/useMutation";

const key = 'ingredients';

export const useGetIngredients = () => {
    const { getAccessToken } = useAuth();
    return useQuery(key, async () => getIngredients(await getAccessToken()), {
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
    });
};

export const useCreateIngredient = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: CreateIngredientProps) => createIngredient(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useUpdateIngredient = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: UpdateIngredientProps) => updateIngredient(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useDeleteIngredient = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (id: number) => deleteIngredient(await getAccessToken(), id), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}