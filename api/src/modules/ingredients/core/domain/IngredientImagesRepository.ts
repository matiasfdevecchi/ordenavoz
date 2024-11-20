import { AwsIngredientImagesRepository } from "../../infrastructure/AwsIngredientImagesRepository";

export interface IngredientImagesRepository {
    save(prefix: string, images: Express.Multer.File): Promise<string>;
    replace(previousPrefix: string, prefix: string, images: Express.Multer.File): Promise<string>;
    remove(url: string): Promise<void>;
}

export const ingredientImagesRepository = new AwsIngredientImagesRepository();