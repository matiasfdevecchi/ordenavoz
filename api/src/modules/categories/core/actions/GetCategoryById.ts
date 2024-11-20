import { CategoryNotFound } from '../domain/errors/CategoryNotFound';
import { Category, CategoryId, CategoryProps } from '../domain/Category';
import { categoryRepository, CategoryRepository } from '../domain/CategoryRepository';

class GetCategoryById {
  constructor(private categoryRepository: CategoryRepository) { }

  async invoke(id: CategoryId): Promise<Category> {
    const category = await this.categoryRepository.getById(id);
    if (!category)
      throw new CategoryNotFound(id);
    return category;
  }
}

export const getCategoryById = new GetCategoryById(categoryRepository);
