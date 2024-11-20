import { HandledError } from "../utils/HandledError";
import { Category, CategoryId, CategoryProps } from "./Category"

export const getCategories = async (accessToken: string): Promise<Category[]> => {
    console.log(accessToken);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return data.map(Category.fromJson);
}

export type CreateCategoryProps = Omit<CategoryProps, "id" | "image"> & { image: File };

export const createCategory = async (accessToken: string, props: CreateCategoryProps): Promise<Category> => {
    const formData = new FormData();
    formData.append("name", props.name);
    formData.append("images", props.image);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
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
    return Category.fromJson(data);
}

export type UpdateCategoryProps = Partial<CreateCategoryProps> & { id: CategoryId };

export const updateCategory = async (accessToken: string, props: UpdateCategoryProps): Promise<Category> => {
    const { id, ...rest } = props;

    const formData = new FormData();
    if (rest.name) {
        formData.append("name", rest.name);
    }
    if (rest.image) {
        formData.append("images", rest.image);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${id}`, {
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
    return Category.fromJson(data);
}

export const deleteCategory = async (accessToken: string, id: CategoryId): Promise<Category> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${id}`, {
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
    return Category.fromJson(data);
}