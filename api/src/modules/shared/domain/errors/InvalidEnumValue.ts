import { ErrorType, HandledError } from './HandledError';

export class InvalidEnumValue extends HandledError {
  constructor(name: string, invalidValue: string, values: string[]) {
    super({
      type: ErrorType.INVALID_ENUM_VALUE,
      params: {
        name,
        invalidValue,
        values,
      },
    });
  }
}
