import { ErrorType, HandledError } from './HandledError';

type Field = string;
type FormParam = string | number | boolean | null | undefined;

export class InvalidState extends HandledError {
  constructor(resource: string, error: Record<Field, FormParam>, message: string) {
    super({
      type: ErrorType.INVALID_STATE,
      params: {
        resource,
        error,
        message
      },
    });
  }
}
