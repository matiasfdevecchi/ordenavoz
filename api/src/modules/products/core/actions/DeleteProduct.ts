import { productRepository, ProductRepository } from '../domain/ProductRepository';
import { Product, ProductId } from '../domain/Product';
import { productService, ProductService } from '../domain/ProductService';
import { ProductNotFound } from '../domain/errors/ProductNotFound';

class DeleteProduct {
  constructor(private productService: ProductService, private productRepository: ProductRepository) { }

  invoke(id: ProductId): Promise<Product> {
    return this.productRepository.getById(id).then((product) => {
      if (!product) {
        throw new ProductNotFound(id);
      }
      return this.productService.delete(product);
    });
  }
}

export const deleteProduct = new DeleteProduct(productService, productRepository);
