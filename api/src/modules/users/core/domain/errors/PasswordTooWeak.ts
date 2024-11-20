import { ErrorType, HandledError } from "../../../../shared/domain/errors/HandledError";

export class PasswordTooWeak extends HandledError {
  constructor() {
    super({
      type: ErrorType.PASSWORD_TO_WEAK,
      params: {},
    });
  }
}