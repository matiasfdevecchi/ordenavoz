import { Category } from '../domain/Category';
import { categoryRepository, CategoryRepository } from '../domain/CategoryRepository';

class GetAllCategories {
  constructor(private categoryRepository: CategoryRepository) {}

  invoke(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }
}

export const getAllCategories = new GetAllCategories(categoryRepository);
