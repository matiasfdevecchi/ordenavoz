import { Repository, FindOneOptions } from 'typeorm';
import { CategoryRepository } from '../core/domain/CategoryRepository';
import { TypeormCategory } from './TypeormCategory';
import { Category, CategoryId } from '../core/domain/Category';
import { CategoryNotFound } from '../core/domain/errors/CategoryNotFound';


export class TypeormCategoryRepository implements CategoryRepository {
    constructor(
        private repository: Repository<TypeormCategory>
    ) { }

    private relations: FindOneOptions<TypeormCategory>['relations'] = {}

    async save(category: Category): Promise<Category> {
        const createdCategory = await this.repository.save(TypeormCategory.from(category));
        return createdCategory.toDomain();
    }

    async getAll(): Promise<Category[]> {
        const categories = await this.repository.find({});

        return categories.map(category => category.toDomain());
    }

    async delete(id: CategoryId): Promise<Category> {
        const category = await this.repository.findOne({
            where: { id: id },
            relations: this.relations,
        });
        if (!category) {
            throw new CategoryNotFound(id);
        }
        return (await this.repository.remove(category)).toDomain();
    }

    async getById(id: CategoryId): Promise<Category | undefined> {
        const category = await this.repository.findOne({
            where: { id },
            relations: this.relations,
        });

        return category?.toDomain() ?? undefined;
    }

    async getByName(name: string): Promise<Category | undefined> {
        const category = await this.repository.findOne({
            where: { name },
            relations: this.relations,
        });

        return category?.toDomain() ?? undefined;
    }

    async isLinkedToProducts(id: CategoryId): Promise<boolean> {
        const category = await this.repository.findOne({ where: { id }, relations: ['products'] });
        return (category?.products.length ?? 0) > 0;
    }
}