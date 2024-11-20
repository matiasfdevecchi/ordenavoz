import { QueryRunner } from "typeorm";
import { typeormUnitOfWork } from "../infrastructure/typeorm/TypeormUnitOfWork";

export interface UnitOfWork {
    startTransaction(): Promise<QueryRunner>;
    commit(runner: QueryRunner): Promise<void>;
    rollback(runner: QueryRunner): Promise<void>;
    release(runner: QueryRunner): Promise<void>;
}

export const unitOfWork = typeormUnitOfWork;