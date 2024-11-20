import speech from '@google-cloud/speech';
import fs from 'fs';
import path from 'path';
import {STTClient} from "../core/domain/STTClient";
import {google} from "@google-cloud/speech/build/protos/protos";
import AudioEncoding = google.cloud.speech.v1.RecognitionConfig.AudioEncoding;
import IRecognizeRequest = google.cloud.speech.v1.IRecognizeRequest;

export class GoogleCloudSTTClient implements STTClient {
    private sttClient;

    constructor() {
        this.sttClient = new speech.SpeechClient({
            keyFilename: path.join('googlekey.json')
        });
    }

    // Implementación de Speech-to-Text
    async transcribeAudio(filePath: string): Promise<string> {

        const file = fs.readFileSync(filePath).toString('base64');

        // Transcribes your audio file using the specified configuration.
        const config = {
            model: "telephony",
            encoding: AudioEncoding.MP3,
            sampleRateHertz: 16000,
            audioChannelCount: 1,
            enableWordTimeOffsets: false,
            enableWordConfidence: false,
            languageCode: "es-AR",
        };

        const request : IRecognizeRequest  = {
            audio: {content:file},
            config: config,
        };

        // @ts-ignore
        const [response] = await this.sttClient.recognize(request);

        let transcription = "";

        if (response.results){
            transcription = response.results
                .map(result => result.alternatives?result.alternatives[0].transcript : "")
                .join('\n');

        }
        return transcription;
    }
}
