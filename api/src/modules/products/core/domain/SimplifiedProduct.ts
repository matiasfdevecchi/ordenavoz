import { IngredientId } from "../../../ingredients/core/domain/Ingredient";
import { ProductId } from "./Product"

export type SimplifiedIngredient = {
    id: IngredientId;
    name: string;
    quantity: number;
}

export type SimplifiedProduct = {
    id: ProductId;
    name: string;
    categoryName: string;
    ingredients: SimplifiedIngredient[];
}