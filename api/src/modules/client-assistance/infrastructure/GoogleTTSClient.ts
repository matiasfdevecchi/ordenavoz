import textToSpeech from '@google-cloud/text-to-speech';
import { TTSClient } from '../core/domain/TTSClient';
import fs from 'fs';
import { promisify } from 'util';
import {google} from "@google-cloud/text-to-speech/build/protos/protos";
import ISynthesizeSpeechRequest = google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;
import { join } from 'path';

export class GoogleCloudTTSClient implements TTSClient {
    private client;

    constructor() {
        this.client = new textToSpeech.TextToSpeechClient({
            keyFilename: join('googlekey.json')
        });
    }

    async generateBase64Audio(text: string): Promise<string> {
        const request : ISynthesizeSpeechRequest = {
            input: { text },
            voice: {
                languageCode: 'es-US', // You can change the language and voice here
                ssmlGender: 'MALE',
                name : 'es-US-Standard-B'

            },
            audioConfig: {
                audioEncoding: 'MP3',
            },
        };

        // Performs the text-to-speech request
        const [response] = await this.client.synthesizeSpeech(request);

        // Convert audio content to Base64
        const buffer = Buffer.from(response.audioContent as string, 'binary');
        return buffer.toString('base64');
    }

    async saveAudioToFile(text: string, outputFilePath: string): Promise<void> {
        const request : ISynthesizeSpeechRequest = {
            input: { text },
            voice: {
                languageCode: 'es-US',
                ssmlGender: 'MALE',
            },
            audioConfig: {
                audioEncoding: 'MP3',
            },
        };

        // Performs the text-to-speech request0.

        const [response] = await this.client.synthesizeSpeech(request);

        // Write the binary audio content to a file
        const writeFile = promisify(fs.writeFile);
        await writeFile(outputFilePath, response.audioContent as string, 'binary');
        console.log(`Audio content written to file: ${outputFilePath}`);
    }
}
