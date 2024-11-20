import { ErrorType, HandledError } from "../../../../shared/domain/errors/HandledError";

export class PreviousPasswordIsInvalid extends HandledError {
  constructor() {
    super({
      type: ErrorType.PREVIOUS_PASSWORD_IS_INVALID,
      params: {},
    });
  }
}