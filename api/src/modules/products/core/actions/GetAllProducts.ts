import { Product } from "../domain/Product";
import { GetAllParams, ProductRepository, productRepository } from "../domain/ProductRepository";

class GetAllProducts {
  constructor(private productRepository: ProductRepository) {}

  invoke(params: GetAllParams): Promise<Product[]> {
    return this.productRepository.getAll(params);
  }
}

export const getAllProducts = new GetAllProducts(productRepository);
