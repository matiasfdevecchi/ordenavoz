import { consultByAudio } from "../../../modules/client-assistance/core/actions/ConsultByAudio";
import { consultByText } from "../../../modules/client-assistance/core/actions/ConsultByText";
import { BadRequest } from "../../../modules/shared/domain/errors/BadRequest";
import Controller from "./controller";
import path from 'path';

export const consultByTextController: Controller = async (req, res) => {
    const { sessionId, content } = req.body;
    const action = await consultByText.invoke(sessionId, content);
    res.status(200).json({ action });
}

export const consultByAudioController: Controller = async (req, res) => {
    if (!req.file) {
        throw new BadRequest("No se subió ningún archivo de audio.");
    }
    const audioPath = path.resolve(req.file.path);

    const { sessionId } = req.body;

    const response = await consultByAudio.invoke(sessionId, audioPath);
    res.status(200).json(response);
}