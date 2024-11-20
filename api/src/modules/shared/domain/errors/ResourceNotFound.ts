import { ErrorType, HandledError, Resource } from './HandledError';

export class ResourceNotFound extends HandledError {
  constructor(resource: Resource, props: Record<string, any>) {
    super({
      type: ErrorType.RESOURCE_NOT_FOUND,
      params: {
        resource,
        props,
      },
    });
  }
}
