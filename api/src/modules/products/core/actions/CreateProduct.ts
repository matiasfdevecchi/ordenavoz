import { Product, ProductProps } from "../domain/Product";
import { ProductService, productService } from "../domain/ProductService";

class CreateProduct {
  constructor(private productService: ProductService) { }

  async invoke(props: Omit<ProductProps, 'id' | 'image'>, image: Express.Multer.File): Promise<Product> {
    return this.productService.create(props, image);
  }
}

export const createProduct = new CreateProduct(productService);
