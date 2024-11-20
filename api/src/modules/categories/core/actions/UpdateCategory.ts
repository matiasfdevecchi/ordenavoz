import { removeUndefined } from "../../../shared/domain/utils/object";
import { CategoryNotFound } from "../domain/errors/CategoryNotFound";
import { Category, CategoryId, CategoryProps } from "../domain/Category";
import { categoryRepository, CategoryRepository } from "../domain/CategoryRepository";
import { categoryService, CategoryService } from "../domain/CategoryService";

class UpdateCategory {
    constructor(private categoryService: CategoryService, private repository: CategoryRepository) { }

    async invoke(id: CategoryId, params: Partial<Omit<CategoryProps, "id" | "image">>, image: Express.Multer.File | undefined): Promise<Category> {
        const category = await this.repository.getById(id);
        if (!category)
            throw new CategoryNotFound(id);

        const updatedCategory = category.copy(removeUndefined(params));
        return this.categoryService.update(updatedCategory, image);
    }
}

export const updateCategory = new UpdateCategory(categoryService, categoryRepository);