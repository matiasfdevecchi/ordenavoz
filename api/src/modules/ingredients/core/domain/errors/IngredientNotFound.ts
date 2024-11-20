import { Resource } from "../../../../shared/domain/errors/HandledError";
import { ResourceNotFound } from "../../../../shared/domain/errors/ResourceNotFound";
import { IngredientId } from "../Ingredient";

export class IngredientNotFound extends ResourceNotFound {
    constructor(id: IngredientId) {
        super(Resource.INGREDIENT, { id });
    }
}