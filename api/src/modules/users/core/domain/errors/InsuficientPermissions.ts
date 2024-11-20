import { ErrorType, HandledError } from "../../../../shared/domain/errors/HandledError";

export class InsuficientPermissions extends HandledError {
  constructor() {
    super({
      type: ErrorType.INSUFICIENT_PERMISSIONS,
      params: {},
    });
  }
}