import { useQueryClient } from "react-query";
import useAuth from "../../auth/useAuth";
import useQuery from "../../hooks/useQuery";
import { createUser, CreateUserProps, deleteUser, getUsers } from "./_queries";
import useMutation from "../../hooks/useMutation";
import { UserId } from "./User";

const key = 'users';

export const useGetUsers = () => {
    const { getAccessToken } = useAuth();
    return useQuery(key, async () => getUsers(await getAccessToken()), {
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
    });
};

export const useCreateUser = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (props: CreateUserProps) => createUser(await getAccessToken(), props), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}

export const useDeleteUser = () => {
    const { getAccessToken } = useAuth();
    const queryClient = useQueryClient();
    return useMutation(async (id: UserId) => deleteUser(await getAccessToken(), id), {
        onSuccess: () => queryClient.invalidateQueries(key)
    });
}