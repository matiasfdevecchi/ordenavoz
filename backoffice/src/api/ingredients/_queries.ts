import { HandledError } from "../utils/HandledError";
import { Ingredient, IngredientId, IngredientProps } from "./Ingredient"

export const getIngredients = async (accessToken: string): Promise<Ingredient[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/ingredients`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return data.map(Ingredient.fromJson);
}

export type CreateIngredientProps = Omit<IngredientProps, "id" | "image"> & { image: File };

export const createIngredient = async (accessToken: string, props: CreateIngredientProps): Promise<Ingredient> => {
    const formData = new FormData();
    formData.append("name", props.name);
    formData.append("images", props.image);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/ingredients`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return Ingredient.fromJson(data);
}

export type UpdateIngredientProps = Partial<CreateIngredientProps> & { id: IngredientId };

export const updateIngredient = async (accessToken: string, props: UpdateIngredientProps): Promise<Ingredient> => {
    const { id, ...rest } = props;

    const formData = new FormData();
    if (rest.name) {
        formData.append("name", rest.name);
    }
    if (rest.image) {
        formData.append("images", rest.image);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/ingredients/${id}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return Ingredient.fromJson(data);
}

export const deleteIngredient = async (accessToken: string, id: IngredientId): Promise<Ingredient> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/ingredients/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return Ingredient.fromJson(data);
}