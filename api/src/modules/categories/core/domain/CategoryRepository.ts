import { typeormUnitOfWork } from '../../../shared/infrastructure/typeorm/TypeormUnitOfWork';
import { TypeormCategory } from '../../infrastructure/TypeormCategory';
import { TypeormCategoryRepository } from '../../infrastructure/TypeormCategoryRepository';
import { Category, CategoryId } from './Category';

export interface CategoryRepository {
  save(category: Category): Promise<Category>;
  getById(id: CategoryId): Promise<Category | undefined>;
  getByName(name: string): Promise<Category | undefined>;
  getAll(): Promise<Category[]>;
  delete(id: CategoryId): Promise<Category>;
  isLinkedToProducts(id: CategoryId): Promise<boolean>;
}

export const categoryRepository = new TypeormCategoryRepository(
  typeormUnitOfWork.getRepository(TypeormCategory),
);
