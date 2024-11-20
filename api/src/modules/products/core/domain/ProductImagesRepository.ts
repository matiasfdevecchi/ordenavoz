import { AwsProductImagesRepository } from "../../infrastructure/AwsProductImagesRepository";

export interface ProductImagesRepository {
    save(prefix: string, images: Express.Multer.File): Promise<string>;
    replace(previousPrefix: string, prefix: string, images: Express.Multer.File): Promise<string>;
    remove(url: string): Promise<void>;
}

export const productImagesRepository = new AwsProductImagesRepository();