import { removeUndefined } from "../../../shared/domain/utils/object";
import { ProductNotFound } from "../domain/errors/ProductNotFound";
import { Product, ProductId, ProductProps } from "../domain/Product";
import { productRepository, ProductRepository } from "../domain/ProductRepository";
import { productService, ProductService } from "../domain/ProductService";

class UpdateProduct {
    constructor(private productService: ProductService, private repository: ProductRepository) { }

    async invoke(id: ProductId, params: Partial<Omit<ProductProps, "id" | "image">>, image: Express.Multer.File | undefined): Promise<Product> {
        const product = await this.repository.getById(id);
        if (!product)
            throw new ProductNotFound(id);

        const updatedProduct = product.copy(removeUndefined(params));
        return this.productService.update(updatedProduct, image);
    }
}

export const updateProduct = new UpdateProduct(productService, productRepository);