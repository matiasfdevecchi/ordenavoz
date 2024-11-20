import { AssistanceAction, SessionId } from "../domain/Action";
import { clientAssistanceService, ClientAssistanceService } from "../domain/ClientAssitanceService";

class ConsultByText {
    constructor(private readonly clientAssistanceService: ClientAssistanceService) {}
    
    async invoke(id: SessionId, content: string): Promise<AssistanceAction> {
        return this.clientAssistanceService.consultByText(id, content);
    }
}

export const consultByText = new ConsultByText(clientAssistanceService);