import { TypeormProductIngredient } from '../../../products/infrastructure/TypeormProductIngredient';
import { typeormUnitOfWork } from '../../../shared/infrastructure/typeorm/TypeormUnitOfWork';
import { TypeormIngredient } from '../../infrastructure/TypeormIngredient';
import { TypeormIngredientRepository } from '../../infrastructure/TypeormIngredientRepository';
import { Ingredient, IngredientId } from './Ingredient';

export interface IngredientRepository {
  save(ingredient: Ingredient): Promise<Ingredient>;
  getById(id: IngredientId): Promise<Ingredient | undefined>;
  getByName(name: string): Promise<Ingredient | undefined>;
  getAll(): Promise<Ingredient[]>;
  delete(id: IngredientId): Promise<Ingredient>;
  isLinkedToProducts(id: IngredientId): Promise<boolean>;
}

export const ingredientRepository = new TypeormIngredientRepository(
  typeormUnitOfWork.getRepository(TypeormIngredient),
  typeormUnitOfWork.getRepository(TypeormProductIngredient),
);
