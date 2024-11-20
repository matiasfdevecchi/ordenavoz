import { createProduct, CreateProductProps, deleteProduct, getProductById, getProducts, updateProduct, UpdateProductProps } from "./_queries";
import useAuth from "../../auth/useAuth";
import useQuery from "../../hooks/useQuery";
import { useQueryClient } from "react-query";
import useMutation from "../../hooks/useMutation";
import { ProductId } from "./Product";
import { CategoryId } from "../categories/Category";

const key = 'products';

export const useGetProducts = (categoryId?: CategoryId, fetchOnlyWithCategoryId?: boolean) => {
    const { getAccessToken } = useAuth();

    return useQuery(
        [key, categoryId],
        async () => {
            const accessToken = await getAccessToken();
            return getProducts(accessToken, categoryId);
        },
        {
            enabled: !fetchOnlyWithCategoryId || !!categoryId,
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
        }
    );
};

export const useGetProductById = (id: ProductId) => {
    const { getAccessToken } = useAuth();
    return useQuery([key, id], async () => getProductById(await getAccessToken(), id), {
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
        enabled: !!id, // Solo ejecuta la query si hay un ID
    });
};

export const useCreateProduct = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: CreateProductProps) => createProduct(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useUpdateProduct = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: UpdateProductProps) => updateProduct(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useDeleteProduct = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (id: number) => deleteProduct(await getAccessToken(), id), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}
