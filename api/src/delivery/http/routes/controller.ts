import { Request, Response } from "express";
import Middleware from "../middlewares/middleware";

type Controller = (req: Request, res: Response) => Promise<void>;

export const defaultController: (controller: Controller) => Middleware = (controller: Controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res);
        } catch (error: any) {
            next(error);
        }
    }
}

export default Controller;