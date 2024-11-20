import { SimplifiedProduct } from "../../../products/core/domain/SimplifiedProduct";
import { OpenAISdkAIClient } from "../../infrastructure/OpenAISdkAIClient";
import { AssistanceAction, AssistanceMessage, SessionId } from "./Action";

type ConsultResponse = {
    message: AssistanceMessage;
    action: AssistanceAction;
}

export interface AIClient {
    consult(messages: AssistanceMessage[]): Promise<ConsultResponse>;
    getInitialMessage(menu: SimplifiedProduct[]): AssistanceMessage;
}

export const aiClient = new OpenAISdkAIClient();