import { WebConfig } from '../domain/WebConfig';
import { WebConfigRepository, webConfigRepository } from '../domain/WebConfigRepository';

class GetWebConfig {
  constructor(private webConfigRepository: WebConfigRepository) { }

  async invoke(): Promise<WebConfig> {
    return this.webConfigRepository.get().then(wc => {
      if (wc) return wc;
      return WebConfig.default();
    })
  }
}

export const getWebConfig = new GetWebConfig(webConfigRepository);
