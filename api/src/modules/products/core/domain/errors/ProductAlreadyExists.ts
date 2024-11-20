import { Resource } from "../../../../shared/domain/errors/HandledError";
import { ResourceAlreadyExists } from "../../../../shared/domain/errors/ResourceAlreadyExists";

export class ProductAlreadyExists extends ResourceAlreadyExists {
    constructor(name: string) {
        super(Resource.PRODUCT, { name });
    }
}