import { ErrorType, HandledError } from "../../../../../shared/domain/errors/HandledError";
import { MpUserId } from "../../../../types";
import { StoreId } from "../Store";

export class StoreNotFoundInMpUser extends HandledError {
    constructor(userId: MpUserId, storeId: StoreId) {
        super({
            type: ErrorType.MERCADO_PAGO_STORE_NOT_FOUND,
            params: { userId, storeId },
        });
    }
}