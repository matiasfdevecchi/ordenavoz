import { NextFunction, Request, Response } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => (Promise<void> | void);

export default Middleware;