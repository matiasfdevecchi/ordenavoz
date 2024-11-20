import { createProduct } from "../../../modules/products/core/actions/CreateProduct";
import { deleteProduct } from "../../../modules/products/core/actions/DeleteProduct";
import { getAllProducts } from "../../../modules/products/core/actions/GetAllProducts";
import { getProductById } from "../../../modules/products/core/actions/GetProductById";
import { updateProduct } from "../../../modules/products/core/actions/UpdateProduct";
import { getProductId, getImages, getOptionalImages } from "../utils/Functions";
import Controller from "./controller";

export const getAllProductsController: Controller = async (req, res) => {
    const products = await getAllProducts.invoke({
        categoryId: req.query.categoryId as number | undefined,
    });

    res.status(200).json(products);
}

export const getProductByIdController: Controller = async (req, res) => {
    const product = await getProductById.invoke(getProductId(req));

    res.status(200).json(product);
}

export const createProductController: Controller = async (req, res) => {
    const { name, category, ingredients, price } = req.body;
    const image = getImages(req, 'images')[0];

    const ingredient = await createProduct.invoke({
        name,
        category,
        ingredients,
        price,
    }, image);
    res.status(201).json(ingredient);
}

export const updateProductController: Controller = async (req, res) => {
    const { name, categoryId, ingredients, price } = req.body;

    const images = getOptionalImages(req, 'images');
    const image = images !== undefined && images.length > 0 ? images[0] : undefined;

    const ingredient = await updateProduct.invoke(getProductId(req), {
        name,
        category: { id: categoryId },
        ingredients,
        price,
    }, image);
    res.status(200).json(ingredient);
}

export const deleteProductController: Controller = async (req, res) => {
    const product = await deleteProduct.invoke(getProductId(req));
    res.status(200).json(product);
}