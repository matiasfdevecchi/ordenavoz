import { Resource } from "../../../../shared/domain/errors/HandledError";
import { ResourceNotFound } from "../../../../shared/domain/errors/ResourceNotFound";
import { CategoryId } from "../Category";

export class CategoryNotFound extends ResourceNotFound {
    constructor(id: CategoryId) {
        super(Resource.CATEGORY, { id });
    }
}