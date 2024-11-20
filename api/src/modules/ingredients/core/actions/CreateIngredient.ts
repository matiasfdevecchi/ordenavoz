import { Ingredient, IngredientProps } from '../domain/Ingredient';
import { ingredientService, IngredientService } from '../domain/IngredientService';

class CreateIngredient {
  constructor(private ingredientService: IngredientService) { }

  async invoke(props: Omit<IngredientProps, 'id' | 'image'>, image: Express.Multer.File): Promise<Ingredient> {
    return this.ingredientService.create(props, image);
  }
}

export const createIngredient = new CreateIngredient(ingredientService);
