import { createCategory } from "../../../modules/categories/core/actions/CreateCategory";
import { deleteCategory } from "../../../modules/categories/core/actions/DeleteCategory";
import { getAllCategories } from "../../../modules/categories/core/actions/GetAllCategories";
import { updateCategory } from "../../../modules/categories/core/actions/UpdateCategory";
import { getCategoryId, getImages, getOptionalImages } from "../utils/Functions";
import Controller from "./controller";

export const getAllCategoriesController: Controller = async (req, res) => {
    const categories = await getAllCategories.invoke();

    res.status(200).json(categories);
}

export const createCategoryController: Controller = async (req, res) => {
    const { name } = req.body;
    const image = getImages(req, 'images')[0];

    const category = await createCategory.invoke({
        name,
    }, image);
    res.status(201).json(category);
}

export const updateCategoryController: Controller = async (req, res) => {
    const { name } = req.body;

    const images = getOptionalImages(req, 'images');
    const image = images !== undefined && images.length > 0 ? images[0] : undefined;

    const category = await updateCategory.invoke(getCategoryId(req), {
        name,
    }, image);
    res.status(200).json(category);
}

export const deleteCategoryController: Controller = async (req, res) => {
    const category = await deleteCategory.invoke(getCategoryId(req));
    res.status(200).json(category);
}