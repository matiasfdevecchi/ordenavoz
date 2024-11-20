import { ErrorType, HandledError } from "../../../../shared/domain/errors/HandledError";
import { CategoryId } from "../Category";

export class CategoryLinkedToProducts extends HandledError {
    constructor(id: CategoryId) {
        super({
            type: ErrorType.CATEGORY_LINKED_TO_PRODUCTS,
            params: { id },
        });
    }
}