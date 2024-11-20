import { useQueryClient } from "react-query";
import { createCategory, CreateCategoryProps, deleteCategory, getCategories, updateCategory, UpdateCategoryProps } from "./_queries";
import useAuth from "../../auth/useAuth";
import useQuery from "../../hooks/useQuery";
import useMutation from "../../hooks/useMutation";

const key = 'categories';

export const useGetCategories = () => {
    const { getAccessToken } = useAuth();
    return useQuery(key, async () => getCategories(await getAccessToken()), {
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
    });
};

export const useCreateCategory = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: CreateCategoryProps) => createCategory(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useUpdateCategory = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: UpdateCategoryProps) => updateCategory(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useDeleteCategory = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (id: number) => deleteCategory(await getAccessToken(), id), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}