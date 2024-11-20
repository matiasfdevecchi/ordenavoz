import { Product, ProductProps } from "./Product";
import { ProductAlreadyExists } from "./errors/ProductAlreadyExists";
import { productImagesRepository, ProductImagesRepository } from "./ProductImagesRepository";
import { ProductRepository, productRepository } from "./ProductRepository";
import { SimplifiedProduct } from "./SimplifiedProduct";

export class ProductService {
    constructor(private productRepository: ProductRepository, private productImagesRepository: ProductImagesRepository) { }

    private products: SimplifiedProduct[] | undefined;

    async create(props: Omit<ProductProps, 'id' | 'image'>, image: Express.Multer.File) {
        const existingProduct = await this.productRepository.getByName(props.name);
        if (existingProduct) {
            throw new ProductAlreadyExists(props.name);
        }

        return this.productImagesRepository.save(props.name, image).then((urlImage) => {
            return this.productRepository.save(Product.new({ ...props, image: urlImage }));
        });
    }

    async update(product: Product, image: Express.Multer.File | undefined) {
        const existingProduct = await this.productRepository.getByName(product.name);
        if (existingProduct && existingProduct.id !== product.id) {
            throw new ProductAlreadyExists(product.name);
        }

        if (image !== undefined) {
            return this.productImagesRepository.save(product.name, image).then((urlImage) => {
                return this.productRepository.save(product.setImage(urlImage));
            });
        } else {
            return this.productRepository.save(product);
        }
    }

    async delete(product: Product): Promise<Product> {
        return this.productImagesRepository.remove(product.image).then(() => {
            return this.productRepository.delete(product.id);
        });
    }

    async getSimplifiedProducts(): Promise<SimplifiedProduct[]> {
        if (this.products) {
            return this.products;
        }
        return this.productRepository.getAll({}).then(products => {
            this.products = products.map(product => product.toSimplified());
            return this.products;
        });
    }
}

export const productService = new ProductService(productRepository, productImagesRepository);