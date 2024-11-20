import { CategoryId } from '../../../categories/core/domain/Category';
import { typeormUnitOfWork } from '../../../shared/infrastructure/typeorm/TypeormUnitOfWork';
import { TypeormProduct } from '../../infrastructure/TypeormProduct';
import { TypeormProductRepository } from '../../infrastructure/TypeormProductRepository';
import { Product, ProductId } from './Product';

export type GetAllParams = {
  categoryId?: CategoryId;
}

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  getById(id: ProductId): Promise<Product | undefined>;
  getByName(name: string): Promise<Product | undefined>;
  getAll(params: GetAllParams): Promise<Product[]>;
  delete(id: ProductId): Promise<Product>;
}

export const productRepository = new TypeormProductRepository(
  typeormUnitOfWork.getRepository(TypeormProduct),
  typeormUnitOfWork.getDataSource(),
);
