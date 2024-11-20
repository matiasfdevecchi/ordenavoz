import { Repository, FindOneOptions, DataSource } from 'typeorm';
import { GetAllParams, ProductRepository } from '../core/domain/ProductRepository';
import { TypeormProduct } from './TypeormProduct';
import { Product, ProductId } from '../core/domain/Product';
import { ProductNotFound } from '../core/domain/errors/ProductNotFound';
import { TypeormProductIngredient } from './TypeormProductIngredient';


export class TypeormProductRepository implements ProductRepository {
    constructor(
        private repository: Repository<TypeormProduct>,
        private dataSource: DataSource,
    ) { }

    private relations: FindOneOptions<TypeormProduct>['relations'] = {
        category: true,
        ingredients: {
            ingredient: true,
        }
    }

    async save(product: Product): Promise<Product> {
        return this.dataSource.createEntityManager().transaction(async manager => {
            const productEntity = TypeormProduct.from(product);
            const saved = await manager.save(productEntity);
            const productIngredients = product.ingredients.map(i => TypeormProductIngredient.from(i, saved.id));
            const savedIngredients = await manager.save(productIngredients);
            return saved.toDomainWithIngredients(savedIngredients);
        });
    }

    async getAll(params: GetAllParams): Promise<Product[]> {
        const where: FindOneOptions<TypeormProduct>['where'] = {};
        if (params.categoryId) {
            where.category = { id: params.categoryId };
        }

        const products = await this.repository.find({
            relations: this.relations,
            where,
            order: { name: 'ASC' },
        });

        return products.map(product => product.toDomain());
    }

    async delete(id: ProductId): Promise<Product> {
        return await this.dataSource.createEntityManager().transaction(async (manager) => {
            // Load the product with the required relations
            const product = await manager.findOne(TypeormProduct, {
                where: { id: id },
                relations: {
                    ingredients: true,
                }
            });

            if (!product) {
                throw new ProductNotFound(id);
            }

            if (product.ingredients && product.ingredients.length > 0) {
                await manager.remove(product.ingredients);
            }

            const removedProduct = await manager.remove(product);

            return removedProduct.toDomain();
        });
    }

    async getById(id: ProductId): Promise<Product | undefined> {
        const product = await this.repository.findOne({
            where: { id },
            relations: this.relations,
        });

        return product?.toDomain() ?? undefined;
    }

    async getByName(name: string): Promise<Product | undefined> {
        const product = await this.repository.findOne({
            where: { name },
            relations: this.relations,
        });

        return product?.toDomain() ?? undefined;
    }
}