import { IngredientNotFound } from '../domain/errors/IngredientNotFound';
import { Ingredient, IngredientId, IngredientProps } from '../domain/Ingredient';
import { ingredientRepository, IngredientRepository } from '../domain/IngredientRepository';

class GetIngredientById {
  constructor(private ingredientRepository: IngredientRepository) { }

  async invoke(id: IngredientId): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.getById(id);
    if (!ingredient)
      throw new IngredientNotFound(id);
    return ingredient;
  }
}

export const getIngredientById = new GetIngredientById(ingredientRepository);
