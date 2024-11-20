import { ingredientRepository, IngredientRepository } from "./IngredientRepository";
import { Ingredient, IngredientProps } from "./Ingredient";
import { IngredientAlreadyExists } from "./errors/IngredientAlreadyExists";
import { ingredientImagesRepository, IngredientImagesRepository } from "./IngredientImagesRepository";
import { IngredientLinkedToProducts } from "./errors/IngredientLinkedToProducts";

export class IngredientService {
    constructor(private ingredientRepository: IngredientRepository, private ingredientImagesRepository: IngredientImagesRepository) { }

    async create(props: Omit<IngredientProps, 'id' | 'image'>, image: Express.Multer.File) {
        const existingIngredient = await this.ingredientRepository.getByName(props.name);
        if (existingIngredient) {
            throw new IngredientAlreadyExists(props.name);
        }

        return this.ingredientImagesRepository.save(props.name, image).then((urlImage) => {
            return this.ingredientRepository.save(Ingredient.new({ ...props, image: urlImage }));
        });
    }

    async update(ingredient: Ingredient, image: Express.Multer.File | undefined) {
        const existingIngredient = await this.ingredientRepository.getByName(ingredient.name);
        if (existingIngredient && existingIngredient.id !== ingredient.id) {
            throw new IngredientAlreadyExists(ingredient.name);
        }

        if (image !== undefined) {
            return this.ingredientImagesRepository.save(ingredient.name, image).then((urlImage) => {
                return this.ingredientRepository.save(ingredient.setImage(urlImage));
            });
        } else {
            return this.ingredientRepository.save(ingredient);
        }
    }

    async delete(ingredient: Ingredient): Promise<Ingredient> {
        if (await this.ingredientRepository.isLinkedToProducts(ingredient.id)) {
            throw new IngredientLinkedToProducts(ingredient.id);
        }
        return this.ingredientImagesRepository.remove(ingredient.image).then(() => {
            return this.ingredientRepository.delete(ingredient.id);
        });
    }
}

export const ingredientService = new IngredientService(ingredientRepository, ingredientImagesRepository);