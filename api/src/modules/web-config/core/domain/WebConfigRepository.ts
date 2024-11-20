import { typeormUnitOfWork } from "../../../shared/infrastructure/typeorm/TypeormUnitOfWork";
import { TypeormWebConfig } from "../../infrastructure/TypeormWebConfig";
import { TypeormWebConfigRepository } from "../../infrastructure/TypeormWebConfigRepository";
import { WebConfig } from "./WebConfig";

export interface WebConfigRepository {
    save(webConfig: WebConfig): Promise<WebConfig>;
    get(): Promise<WebConfig | undefined>;
}

export const webConfigRepository = new TypeormWebConfigRepository(typeormUnitOfWork.getRepository(TypeormWebConfig))