import { categoryRepository, CategoryRepository } from "./CategoryRepository";
import { Category, CategoryId, CategoryProps } from "./Category";
import { CategoryAlreadyExists } from "./errors/CategoryAlreadyExists";
import { categoryImagesRepository, CategoryImagesRepository } from "./CategoryImagesRepository";
import { CategoryLinkedToProducts } from "./errors/CategoryLinkedToProducts";

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository, private categoryImagesRepository: CategoryImagesRepository) { }

    async create(props: Omit<CategoryProps, 'id' | 'image'>, image: Express.Multer.File) {
        const existingCategory = await this.categoryRepository.getByName(props.name);
        if (existingCategory) {
            throw new CategoryAlreadyExists(props.name);
        }

        return this.categoryImagesRepository.save(props.name, image).then((urlImage) => {
            return this.categoryRepository.save(Category.new({ ...props, image: urlImage }));
        });
    }

    async update(category: Category, image: Express.Multer.File | undefined) {
        const existingCategory = await this.categoryRepository.getByName(category.name);
        if (existingCategory && existingCategory.id !== category.id) {
            throw new CategoryAlreadyExists(category.name);
        }

        if (image !== undefined) {
            return this.categoryImagesRepository.save(category.name, image).then((urlImage) => {
                return this.categoryRepository.save(category.setImage(urlImage));
            });
        } else {
            return this.categoryRepository.save(category);
        }
    }

    async delete(category: Category): Promise<Category> {
        if (await this.categoryRepository.isLinkedToProducts(category.id)) {
            throw new CategoryLinkedToProducts(category.id);
        }
        return this.categoryImagesRepository.remove(category.image).then(() => {
            return this.categoryRepository.delete(category.id);
        });
    }
}

export const categoryService = new CategoryService(categoryRepository, categoryImagesRepository);