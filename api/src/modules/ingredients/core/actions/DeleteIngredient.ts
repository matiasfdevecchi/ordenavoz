import { ingredientRepository, IngredientRepository } from '../domain/IngredientRepository';
import { Ingredient, IngredientId } from '../domain/Ingredient';
import { ingredientService, IngredientService } from '../domain/IngredientService';
import { IngredientNotFound } from '../domain/errors/IngredientNotFound';

class DeleteIngredient {
  constructor(private ingredientService: IngredientService, private ingredientRepository: IngredientRepository) { }

  invoke(id: IngredientId): Promise<Ingredient> {
    return this.ingredientRepository.getById(id).then((ingredient) => {
      if (!ingredient) {
        throw new IngredientNotFound(id);
      }
      return this.ingredientService.delete(ingredient);
    });
  }
}

export const deleteIngredient = new DeleteIngredient(ingredientService, ingredientRepository);
