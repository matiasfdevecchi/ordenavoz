import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import {
  ErrorType,
  HandledError,
} from '../../../modules/shared/domain/errors/HandledError';
import logger from '../../../logger';

const getHandledErrorStatusCode = (error: HandledError): number => {
  switch (error.getMessage().type) {
    case ErrorType.BAD_REQUEST:
      return 400;
    case ErrorType.RESOURCE_ALREADY_EXISTS, ErrorType.INSUFICIENT_STOCK:
      return 409;
    case ErrorType.RESOURCE_NOT_FOUND, ErrorType.RESOURCES_NOT_FOUND:
      return 404;
    case ErrorType.INVALID_ENUM_VALUE:
      return 400;
    case ErrorType.USER_AND_TOKEN_MISMATCH:
      return 403;
    case ErrorType.INVALID_STATE:
      return 400;
    case ErrorType.FORM_INVALID_FIELD:
      return 400;
    case ErrorType.ACCESS_DENIED:
      return 403;
    default:
      return 500;
  }
}

export const GetErrorStatusCode = (error: Error): number => {
  if (Array.isArray(error)) {
    if (error.every((e) => e instanceof HandledError)) {
      return getHandledErrorStatusCode(error[0] as HandledError);
    }
  }

  if (error instanceof HandledError) {
    return getHandledErrorStatusCode(error);
  }

  // TODO: generar errores de open api

  if (error instanceof UnauthorizedError) {
    return error.status;
  }

  return 500;
};

export const GetErrorMessage = (error: Error): any => {
  const getError = (error: Error): any => {
    if (error instanceof HandledError) {
      return error.getMessage();
    }
  
    if (Array.isArray(error)) {  
      if (error.every((e) => e instanceof HandledError)) {
        return error.map((e) => e.getMessage());
      }
    }
  
    if (error instanceof UnauthorizedError) {
      return {
        type: ErrorType.UNAUTHORIZED,
        params: {
          message: error.message,
        }
      }
    }
  
    return {
      type: ErrorType.UNKNOWN,
      params: {
        message: error.message,
      }
    };
  }

  const e = getError(error);
  logger.error(e);
  return e;
};
