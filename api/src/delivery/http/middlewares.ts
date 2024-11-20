import express, { Application } from 'express';
import cors from 'cors';
import winston from 'winston';
import expressWinston from 'express-winston';
import { getWinstonFilePath } from '../../logger';

/*

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const current_datetime = new Date();
  const formatted_date =
    current_datetime.getFullYear() +
    '-' +
    (current_datetime.getMonth() + 1) +
    '-' +
    current_datetime.getDate() +
    ' ' +
    current_datetime.getHours() +
    ':' +
    current_datetime.getMinutes() +
    ':' +
    current_datetime.getSeconds();
  const method = req.method;
  const url = req.url;
  const log = `[${formatted_date}] ${method} ${url}`;
  // eslint-disable-next-line no-console
  console.log(log);
  next();
};

*/

const secretHeaders = ["authorization", "cookie"];

export const applyMiddlewares = (app: Application): void => {
  app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }));
  app.use(express.json());
  // app.use(logMiddleware);

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: getWinstonFilePath("request.log") }),
      new winston.transports.File({ filename: getWinstonFilePath("combined.log") }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (_, __) { return false; },
    requestFilter: function (req, propName) {
      if (propName === "headers") {
        const headers = { ...req.headers };
        secretHeaders.forEach((header) => {
          if (headers[header]) {
            headers[header] = "****";
          }
        });
        return headers;
      } else {
        return req[propName]
      }
    }
  }));
};
