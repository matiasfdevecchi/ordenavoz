import { ErrorType, HandledError } from "../../../../shared/domain/errors/HandledError";

export class CantDeleteYourself extends HandledError {
  constructor() {
    super({
      type: ErrorType.CANT_DELETE_YOURSELF,
      params: {},
    });
  }
}