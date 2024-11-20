import { Resource } from "../../../../shared/domain/errors/HandledError";
import { ResourceNotFound } from "../../../../shared/domain/errors/ResourceNotFound";
import { UserId } from "../User";

export class UserNotFound extends ResourceNotFound {
    constructor(id: UserId) {
        super(Resource.USER, { id });
    }
}