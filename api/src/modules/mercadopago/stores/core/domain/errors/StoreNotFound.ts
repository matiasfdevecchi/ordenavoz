import { Resource } from "../../../../../shared/domain/errors/HandledError";
import { ResourceNotFound } from "../../../../../shared/domain/errors/ResourceNotFound";
import { StoreId } from "../Store";

export class StoreNotFound extends ResourceNotFound {
    constructor(id: StoreId) {
        super(Resource.STORE, { id });
    }
}