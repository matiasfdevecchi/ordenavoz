import { Repository, FindOneOptions } from 'typeorm';
import { IngredientRepository } from '../core/domain/IngredientRepository';
import { TypeormIngredient } from './TypeormIngredient';
import { Ingredient, IngredientId } from '../core/domain/Ingredient';
import { IngredientNotFound } from '../core/domain/errors/IngredientNotFound';
import { TypeormProductIngredient } from '../../products/infrastructure/TypeormProductIngredient';


export class TypeormIngredientRepository implements IngredientRepository {
    constructor(
        private repository: Repository<TypeormIngredient>,
        private productIngredientRepository: Repository<TypeormProductIngredient>,
    ) { }

    private relations: FindOneOptions<TypeormIngredient>['relations'] = {}

    async save(ingredient: Ingredient): Promise<Ingredient> {
        const createdIngredient = await this.repository.save(TypeormIngredient.from(ingredient));
        return createdIngredient.toDomain();
    }

    async getAll(): Promise<Ingredient[]> {
        const ingredients = await this.repository.find({});

        return ingredients.map(ingredient => ingredient.toDomain());
    }

    async delete(id: IngredientId): Promise<Ingredient> {
        const ingredient = await this.repository.findOne({
            where: { id: id },
            relations: this.relations,
        });
        if (!ingredient) {
            throw new IngredientNotFound(id);
        }
        return (await this.repository.remove(ingredient)).toDomain();
    }

    async getById(id: IngredientId): Promise<Ingredient | undefined> {
        const ingredient = await this.repository.findOne({
            where: { id },
            relations: this.relations,
        });

        return ingredient?.toDomain() ?? undefined;
    }

    async getByName(name: string): Promise<Ingredient | undefined> {
        const ingredient = await this.repository.findOne({
            where: { name },
            relations: this.relations,
        });

        return ingredient?.toDomain() ?? undefined;
    }

    async isLinkedToProducts(id: IngredientId): Promise<boolean> {
        const count = await this.productIngredientRepository.count({ where: { ingredientId: id } });
        return count > 0;
    }
}