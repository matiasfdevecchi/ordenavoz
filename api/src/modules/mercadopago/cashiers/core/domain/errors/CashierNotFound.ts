import { Resource } from "../../../../../shared/domain/errors/HandledError";
import { ResourceNotFound } from "../../../../../shared/domain/errors/ResourceNotFound";
import { CashierId } from "../Cashier";

export class CashierNotFound extends ResourceNotFound {
    constructor(id: CashierId) {
        super(Resource.CASHIER, { id });
    }
}