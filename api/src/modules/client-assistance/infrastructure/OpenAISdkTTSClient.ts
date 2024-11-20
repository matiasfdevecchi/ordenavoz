import OpenAI from "openai";
import { TTSClient } from "../core/domain/TTSClient";

export class OpenAISdkTTSClient implements TTSClient {

    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }


    async generateBase64Audio(text: string): Promise<string> {
        const response = await this.client.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: text,
        });

        const buffer = Buffer.from(await response.arrayBuffer());

        return buffer.toString('base64');
    }
}