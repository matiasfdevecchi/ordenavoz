import { Resource } from "../../../../../shared/domain/errors/HandledError";
import { ResourceAlreadyExists } from "../../../../../shared/domain/errors/ResourceAlreadyExists";
import { CashierId } from "../Cashier";

export class CashierAlreadyExists extends ResourceAlreadyExists {
    constructor(id: CashierId) {
        super(Resource.CASHIER, { id });
    }
}