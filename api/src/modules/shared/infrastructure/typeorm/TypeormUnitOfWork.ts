import { DataSource, EntityTarget, ObjectLiteral, QueryRunner, Repository } from 'typeorm';
import { UnitOfWork } from '../../domain/UnitOfWork';
import { TypeormConnectionManager } from './TypeormConnectionManager';

export class TypeormUnitOfWork implements UnitOfWork {

    constructor(private dataSource: DataSource) {}

    async startTransaction(): Promise<QueryRunner> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async commit(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.commitTransaction();
    }

    async rollback(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.rollbackTransaction();
    }

    async release(runner: QueryRunner): Promise<void> {
        await runner.release();
    }

    getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
        return this.dataSource.getRepository(entity)
    }

    getDataSource(): DataSource {
        return this.dataSource;
    }
}

export const typeormUnitOfWork = new TypeormUnitOfWork(TypeormConnectionManager.getDataSource());