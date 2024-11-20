import { AwsCategoryImagesRepository } from "../../infrastructure/AwsCategoryImagesRepository";

export interface CategoryImagesRepository {
    save(prefix: string, images: Express.Multer.File): Promise<string>;
    replace(previousPrefix: string, prefix: string, images: Express.Multer.File): Promise<string>;
    remove(url: string): Promise<void>;
}

export const categoryImagesRepository = new AwsCategoryImagesRepository();