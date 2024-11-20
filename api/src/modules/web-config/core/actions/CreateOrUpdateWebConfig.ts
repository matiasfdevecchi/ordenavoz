import { WebConfig, WebConfigProps } from '../domain/WebConfig';
import { WebConfigRepository, webConfigRepository } from '../domain/WebConfigRepository';
import { webConfigService, WebConfigService } from '../domain/WebConfigService';

class CreateOrUpdateWebConfig {
  constructor(private webConfigService: WebConfigService, private webConfigRepository: WebConfigRepository) { }

  async invoke(
    props: Omit<WebConfigProps, 'id'>,
  ): Promise<WebConfig> {
    const previous = await this.webConfigRepository.get();

    const webConfig = this.copyWebConfig(previous, props);
    return this.webConfigService.save(webConfig);
  }

  private copyWebConfig(previous: WebConfig | undefined, props: Omit<WebConfigProps, 'id'>): WebConfig {
    if (!!previous) return previous.copy(props);
    return WebConfig.new(props);
  }
}

export const createOrUpdateWebConfig = new CreateOrUpdateWebConfig(webConfigService, webConfigRepository);
