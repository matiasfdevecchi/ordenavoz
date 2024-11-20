import { Resource } from "../../../../shared/domain/errors/HandledError";
import { ResourceNotFound } from "../../../../shared/domain/errors/ResourceNotFound";
import { OrderId } from "../Order";

export class OrderNotFound extends ResourceNotFound {
    constructor(id: OrderId) {
        super(Resource.ORDER, { id });
    }
}