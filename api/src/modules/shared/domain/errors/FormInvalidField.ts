import { ErrorType, HandledError } from './HandledError';

type Field = string;
type FormParam = string | number | boolean;

export class FormInvalidField extends HandledError {
  constructor(resource: string, error: Record<Field, FormParam>) {
    super({
      type: ErrorType.FORM_INVALID_FIELD,
      params: {
        resource,
        error,
      },
    });
  }
}
