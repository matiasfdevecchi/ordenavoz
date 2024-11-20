import { Ingredient } from '../domain/Ingredient';
import { ingredientRepository, IngredientRepository } from '../domain/IngredientRepository';

class GetAllIngredients {
  constructor(private ingredientRepository: IngredientRepository) {}

  invoke(): Promise<Ingredient[]> {
    return this.ingredientRepository.getAll();
  }
}

export const getAllIngredients = new GetAllIngredients(ingredientRepository);
