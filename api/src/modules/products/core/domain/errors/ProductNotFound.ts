import { Resource } from "../../../../shared/domain/errors/HandledError";
import { ResourceNotFound } from "../../../../shared/domain/errors/ResourceNotFound";
import { ProductId } from "../Product";

export class ProductNotFound extends ResourceNotFound {
    constructor(id: ProductId) {
        super(Resource.PRODUCT, { id });
    }
}