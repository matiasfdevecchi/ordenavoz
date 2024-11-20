import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { TypeormCategory } from '../../../categories/infrastructure/TypeormCategory';
import { TypeormProduct } from '../../../products/infrastructure/TypeormProduct';
import logger from '../../../../logger';
import { TypeormIngredient } from '../../../ingredients/infrastructure/TypeormIngredient';
import { TypeormProductIngredient } from '../../../products/infrastructure/TypeormProductIngredient';
import { TypeormOrder } from '../../../orders/infrastructure/entity/TypeormOrder';
import { TypeormOrderItem } from '../../../orders/infrastructure/entity/TypeormOrderItem';
import { TypeormOrderItemVariantRemovedIngredient } from '../../../orders/infrastructure/entity/TypeormOrderItemRemovedIngredient';
import { TypeormOrderItemVariant } from '../../../orders/infrastructure/entity/TypeormOrderItemVariant';
import { TypeormStore } from '../../../mercadopago/stores/infrastructure/repository/TypeormStore';
import { TypeormCashier } from '../../../mercadopago/cashiers/infrastructure/repository/TypeormCashier';
import { TypeormPayment, TypeormPaymentByCard, TypeormPaymentByCash, TypeormPaymentByMercadoPago } from '../../../orders/infrastructure/entity/TypeormPayment';
import { TypeormWebConfig } from '../../../web-config/infrastructure/TypeormWebConfig';


export class TypeormConnectionManager {
  private static dataSource: DataSource;

  public static async start() {
    await this.createConnection();
  }

  public static getDataSource(): DataSource {
    if (this.dataSource === undefined) {
      throw new Error('Typeorm has not been initialized!');
    }
    return this.dataSource;
  }

  private static async createConnection(): Promise<void> {
    const {
      DB_HOST = 'localhost',
      DB_PORT = '5432',
      DB_USER = 'postgres',
      DB_PASSWORD = 'password',
      DB_NAME = 'postgres',
      DB_SCHEMA = 'public',
      DB_SSL = 'false',
    } = process.env;

    this.dataSource = new DataSource({
      type: 'postgres',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      schema: DB_SCHEMA,
      connectTimeoutMS: 10000,
      maxQueryExecutionTime: 30000,
      extra: {
        query_timeout: 30000,
      },
      entities: [
        TypeormCashier,
        TypeormCategory,
        TypeormIngredient,
        TypeormOrder,
        TypeormOrderItem,
        TypeormOrderItemVariant,
        TypeormOrderItemVariantRemovedIngredient,
        TypeormPayment,
        TypeormPaymentByCard,
        TypeormPaymentByCash,
        TypeormPaymentByMercadoPago,
        TypeormProduct,
        TypeormProductIngredient,
        TypeormStore,
        TypeormWebConfig,
      ],
      synchronize: true,
      ssl: DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    await this.dataSource
      .initialize()
      .then(() => {
        // eslint-disable-next-line no-console
        logger.info('Postgres has been initialized!');
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        logger.error('Error during Postgres initialization', err);
      });
  }

  public static async healthCheck(): Promise<boolean> {
    if (this.dataSource === undefined) {
      logger.error('Typeorm has not been initialized!');
      return false;
    }

    return this.dataSource
      .query('SELECT 1')
      .then(() => {
        return true;
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.error('Error during Postgres health check', err);
        return false;
      });
  }
}
