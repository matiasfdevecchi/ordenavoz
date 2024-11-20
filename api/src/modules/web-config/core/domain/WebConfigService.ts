import { WebConfig } from "./WebConfig";
import { WebConfigRepository, webConfigRepository } from "./WebConfigRepository";

export class WebConfigService {
    constructor(private webConfigRepository: WebConfigRepository) { }

    async save(
        wc: WebConfig,
    ): Promise<WebConfig> {
        return this.webConfigRepository.save(wc);
    }
}

export const webConfigService = new WebConfigService(webConfigRepository);