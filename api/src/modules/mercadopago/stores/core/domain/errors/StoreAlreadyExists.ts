import { Resource } from "../../../../../shared/domain/errors/HandledError";
import { ResourceAlreadyExists } from "../../../../../shared/domain/errors/ResourceAlreadyExists";
import { StoreId } from "../Store";

export class StoreAlreadyExists extends ResourceAlreadyExists {
    constructor(id: StoreId) {
        super(Resource.STORE, { id });
    }
}