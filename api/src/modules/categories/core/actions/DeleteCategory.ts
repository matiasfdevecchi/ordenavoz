import { categoryRepository, CategoryRepository } from '../domain/CategoryRepository';
import { Category, CategoryId } from '../domain/Category';
import { categoryService, CategoryService } from '../domain/CategoryService';
import { CategoryNotFound } from '../domain/errors/CategoryNotFound';

class DeleteCategory {
  constructor(private categoryService: CategoryService, private categoryRepository: CategoryRepository) { }

  invoke(id: CategoryId): Promise<Category> {
    return this.categoryRepository.getById(id).then((category) => {
      if (!category) {
        throw new CategoryNotFound(id);
      }
      return this.categoryService.delete(category);
    });
  }
}

export const deleteCategory = new DeleteCategory(categoryService, categoryRepository);
