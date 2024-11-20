import { CategoryId } from "../categories/Category";
import { HandledError } from "../utils/HandledError";
import { Product, ProductId, ProductProps } from "./Product"

export const getProducts = async (accessToken: string, categoryId?: CategoryId): Promise<Product[]> => {
    const query = categoryId ? `?categoryId=${categoryId}` : "";
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products${query}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    
    return data.map(Product.fromJson);
}

export const getProductById = async (accessToken: string, id: ProductId): Promise<Product> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return Product.fromJson(data);
}

export type CreateProductProps = Omit<ProductProps, "id" | "image"> & { image: File };

export const createProduct = async (accessToken: string, props: CreateProductProps): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", props.name);
    formData.append("price", props.price.toString());
    formData.append("category", JSON.stringify(props.category));
    formData.append("ingredients", JSON.stringify(props.ingredients));

    formData.append("images", props.image);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
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
    return Product.fromJson(data);
}

export type UpdateProductProps = Partial<CreateProductProps> & { id: ProductId };

export const updateProduct = async (accessToken: string, props: UpdateProductProps): Promise<Product> => {
    const formData = new FormData();
    if (props.name)
        formData.append("name", props.name);
    if (props.price)
        formData.append("price", props.price.toString());
    if (props.category)
        formData.append("category", JSON.stringify(props.category));
    if (props.ingredients)
        formData.append("ingredients", JSON.stringify(props.ingredients));
    if (props.image)
        formData.append("images", props.image);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${props.id}`, {
        method: "PATCH",
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
    return Product.fromJson(data);
}

export const deleteProduct = async (accessToken: string, id: ProductId): Promise<Product> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
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
    return Product.fromJson(data);
}