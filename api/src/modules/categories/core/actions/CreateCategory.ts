import { Category, CategoryProps } from '../domain/Category';
import { categoryService, CategoryService } from '../domain/CategoryService';

class CreateCategory {
  constructor(private categoryService: CategoryService) { }

  async invoke(props: Omit<CategoryProps, 'id' | 'image'>, image: Express.Multer.File): Promise<Category> {
    return this.categoryService.create(props, image);
  }
}

export const createCategory = new CreateCategory(categoryService);
