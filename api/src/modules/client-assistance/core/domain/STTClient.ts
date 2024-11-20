import { OpenAISdkTTSClient } from "../../infrastructure/OpenAISdkTTSClient";
import {OpenAISdkSTTSClient} from "../../infrastructure/OpenAISdkSTTClient";
import {GoogleCloudSTTClient} from "../../infrastructure/GoogleSTTClient";

export interface STTClient {
    transcribeAudio(audioPath: string): Promise<string>;
}


export const sttClient = new GoogleCloudSTTClient();