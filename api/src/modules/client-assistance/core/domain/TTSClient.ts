import { OpenAISdkTTSClient } from "../../infrastructure/OpenAISdkTTSClient";
import {GoogleCloudTTSClient} from "../../infrastructure/GoogleTTSClient";

export interface TTSClient {
    generateBase64Audio(text: string): Promise<string>;
}

export const ttsClient = new GoogleCloudTTSClient();