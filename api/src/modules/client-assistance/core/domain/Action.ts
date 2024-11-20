import { IngredientId } from "../../../ingredients/core/domain/Ingredient";
import { ProductId } from "../../../products/core/domain/Product";

export type SessionId = string;

export type AssistanceMessage = {
    role: "system" | "user" | "assistant";
    content: string;
}

export enum ActionType {
    SUGGEST_PRODUCTS = "suggest_products",
    SELECT_PRODUCTS = "select_products",
    MESSAGE = "message",
    PAY = "pay",
}

export type RemovedIngredient = {
    id: IngredientId;
    quantity: number;
}

export type Product = {
    id: ProductId;
    removedIngredients: RemovedIngredient[];
}

export type SuggestProductsAction = {
    type: ActionType.SUGGEST_PRODUCTS;
    products: Product[];
    response: string;
}

export type SelectProductsAction = {
    type: ActionType.SELECT_PRODUCTS;
    products: Product[];
    response: string;
}

export type MessageAction = {
    type: ActionType.MESSAGE;
    response: string;
}

export enum PayMethod {
    MercadoPago = "mercadopago",
    EnCaja = "en_caja",
}
export type PayAction = {
    type: ActionType.PAY;
    method: PayMethod;
    response: string;
}

export type AssistanceAction = SuggestProductsAction | SelectProductsAction | MessageAction | PayAction;

export type AssistanceResponse = {
    audio: string;
    action: AssistanceAction;
}