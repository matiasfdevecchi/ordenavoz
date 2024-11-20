import { Resource } from "../../../../shared/domain/errors/HandledError";
import { ResourceAlreadyExists } from "../../../../shared/domain/errors/ResourceAlreadyExists";

export class CategoryAlreadyExists extends ResourceAlreadyExists {
    constructor(name: string) {
        super(Resource.CATEGORY, { name });
    }
}