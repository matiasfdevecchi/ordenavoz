import { HandledError } from "../utils/HandledError";
import { User, UserId, UserProps } from "./User"

export const getUsers = async (accessToken: string): Promise<User[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return data.map(User.fromJson);
}

export type CreateUserProps = Omit<UserProps, "id" | "picture"> & { password: string };

export const createUser = async (accessToken: string, props: CreateUserProps): Promise<User> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Añade el encabezado Content-Type
        },
        body: JSON.stringify(props), // Convierte el objeto props a una cadena JSON
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return User.fromJson(data);
}

export const deleteUser = async (accessToken: string, id: UserId): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }
}