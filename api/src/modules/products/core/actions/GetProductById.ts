import { ProductNotFound } from '../domain/errors/ProductNotFound';
import { Product, ProductId } from '../domain/Product';
import { productRepository, ProductRepository } from '../domain/ProductRepository';

class GetProductById {
  constructor(private productRepository: ProductRepository) { }

  async invoke(id: ProductId): Promise<Product> {
    const product = await this.productRepository.getById(id);
    if (!product)
      throw new ProductNotFound(id);
    return product;
  }
}

export const getProductById = new GetProductById(productRepository);
