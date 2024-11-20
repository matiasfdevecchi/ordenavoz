import { createIngredient } from "../../../modules/ingredients/core/actions/CreateIngredient";
import { deleteIngredient } from "../../../modules/ingredients/core/actions/DeleteIngredient";
import { getAllIngredients } from "../../../modules/ingredients/core/actions/GetAllIngredients";
import { updateIngredient } from "../../../modules/ingredients/core/actions/UpdateIngredient";
import { getIngredientId, getImages, getOptionalImages } from "../utils/Functions";
import Controller from "./controller";

export const getAllIngredientsController: Controller = async (req, res) => {
    const ingredients = await getAllIngredients.invoke();

    res.status(200).json(ingredients);
}

export const createIngredientController: Controller = async (req, res) => {
    const { name } = req.body;
    const image = getImages(req, 'images')[0];

    const ingredient = await createIngredient.invoke({
        name,
    }, image);
    res.status(201).json(ingredient);
}

export const updateIngredientController: Controller = async (req, res) => {
    const { name } = req.body;

    const images = getOptionalImages(req, 'images');
    const image = images !== undefined && images.length > 0 ? images[0] : undefined;

    const ingredient = await updateIngredient.invoke(getIngredientId(req), {
        name,
    }, image);
    res.status(200).json(ingredient);
}

export const deleteIngredientController: Controller = async (req, res) => {
    const ingredient = await deleteIngredient.invoke(getIngredientId(req));
    res.status(200).json(ingredient);
}