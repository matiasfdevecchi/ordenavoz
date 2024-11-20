import { removeUndefined } from "../../../shared/domain/utils/object";
import { IngredientNotFound } from "../domain/errors/IngredientNotFound";
import { Ingredient, IngredientId, IngredientProps } from "../domain/Ingredient";
import { ingredientRepository, IngredientRepository } from "../domain/IngredientRepository";
import { ingredientService, IngredientService } from "../domain/IngredientService";

class UpdateIngredient {
    constructor(private ingredientService: IngredientService, private repository: IngredientRepository) { }

    async invoke(id: IngredientId, params: Partial<Omit<IngredientProps, "id" | "image">>, image: Express.Multer.File | undefined): Promise<Ingredient> {
        const ingredient = await this.repository.getById(id);
        if (!ingredient)
            throw new IngredientNotFound(id);

        const updatedIngredient = ingredient.copy(removeUndefined(params));
        return this.ingredientService.update(updatedIngredient, image);
    }
}

export const updateIngredient = new UpdateIngredient(ingredientService, ingredientRepository);