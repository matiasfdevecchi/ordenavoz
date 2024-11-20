import { ErrorType, HandledError, Resource } from './HandledError';

export class ResourcesNotFound extends HandledError {
  constructor(resource: Resource, props: Record<string, any>[]) {
    super({
      type: ErrorType.RESOURCES_NOT_FOUND,
      params: {
        resource,
        props,
      },
    });
  }
}
