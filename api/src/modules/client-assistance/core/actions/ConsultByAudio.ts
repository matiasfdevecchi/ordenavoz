import { AssistanceResponse, SessionId } from "../domain/Action";
import { clientAssistanceService, ClientAssistanceService } from "../domain/ClientAssitanceService";
import { ttsClient, TTSClient } from "../domain/TTSClient";
import {sttClient, STTClient} from "../domain/STTClient";



class ConsultByAudio {
    constructor(private readonly ttsClient: TTSClient,private readonly sttClient: STTClient, private readonly clientAssistanceService: ClientAssistanceService) { }

    async invoke(id: SessionId, audioPath: string): Promise<AssistanceResponse> {

        console.time("Transcribe Audio");
        const content = await this.sttClient.transcribeAudio(audioPath);
        console.timeEnd("Transcribe Audio");

        console.time("Consult By Text");
        const action = await this.clientAssistanceService.consultByText(id, content);
        console.timeEnd("Consult By Text");

        console.time("Generate Base64 Audio");
        const audio = await this.ttsClient.generateBase64Audio(action.response);
        console.timeEnd("Generate Base64 Audio");

        return { audio, action };
    }
}

export const consultByAudio = new ConsultByAudio(ttsClient, sttClient, clientAssistanceService);