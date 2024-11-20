import { ErrorType, HandledError } from "../../../../shared/domain/errors/HandledError";
import { IngredientId } from "../Ingredient";

export class IngredientLinkedToProducts extends HandledError {
    constructor(id: IngredientId) {
        super({
            type: ErrorType.INGREDIENT_LINKED_TO_PRODUCTS,
            params: { id },
        });
    }
}