import { Repository, FindOneOptions, IsNull, Not } from 'typeorm';
import { WebConfigRepository } from '../core/domain/WebConfigRepository';
import { TypeormWebConfig } from './TypeormWebConfig';
import { WebConfig } from '../core/domain/WebConfig';

export class TypeormWebConfigRepository implements WebConfigRepository {
    constructor(
        private repository: Repository<TypeormWebConfig>
    ) { }

    private relations: FindOneOptions<TypeormWebConfig>['relations'] = {}

    async save(webConfig: WebConfig): Promise<WebConfig> {
        const createdWebConfig = await this.repository.save(TypeormWebConfig.from(webConfig));
        return createdWebConfig.toDomain();
    }

    async get(): Promise<WebConfig | undefined> {
        const webConfig = await this.repository.findOne({
            where: { id: Not(IsNull()) },
            relations: this.relations,
        });

        return webConfig?.toDomain() ?? undefined;
    }
}