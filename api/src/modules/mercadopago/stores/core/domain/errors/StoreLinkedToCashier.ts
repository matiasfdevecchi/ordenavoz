import { ErrorType, HandledError } from "../../../../../shared/domain/errors/HandledError";
import { StoreId } from "../Store";

export class StoreLinkedToCashiers extends HandledError {
    constructor(id: StoreId) {
        super({
            type: ErrorType.STORE_LINKED_TO_CASHIERS,
            params: { id },
        });
    }
}