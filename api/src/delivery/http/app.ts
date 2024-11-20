import express, { Application, NextFunction, Request, Response } from 'express';
import { applyMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import { GetErrorMessage, GetErrorStatusCode } from './utils/Error';
import { join } from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import * as OpenApiValidator from 'express-openapi-validator';
import logger from '../../logger';
import http from 'http';
import { SocketManager } from '../socket';

const { PORT = 8080 } = process.env;

export class ExpressApp {
  private app: Application;
  private server: http.Server;
  private socketManager: SocketManager;

  public static instance: ExpressApp;

  public static getInstance(): ExpressApp {
    if (!ExpressApp.instance) {
      ExpressApp.instance = new ExpressApp();
    }

    return ExpressApp.instance;
  }

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

    this.socketManager = new SocketManager(this.server);

    applyMiddlewares(this.app);
    this.setupOpenApi();
    setupRoutes(this.app);
    this.setupErrorHandler();
  }

  public start(): void {
    this.server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      logger.info(`Server is listening on port ${PORT}`);
    });
  }

  public emit(room: string, event: string, data: any): void {
    this.socketManager.emitTo(room, event, data);
  }

  private setupErrorHandler(): void {
    this.app.use((error: Error, _: Request, res: Response, next: NextFunction) => {
      let status = GetErrorStatusCode(error);
      if (status >= 500) logger.error(error);
      res.status(status).json(GetErrorMessage(error));
    });
  }

  private setupOpenApi(): void {
    const apiSpec = join('openapi.yaml');
    const openApiSpecification = YAML.load(apiSpec);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec,
        ignorePaths: /.*\/socket.*|^\/speech-to-text$|^\/client-assistance\/audio$/,
        validateRequests: {
          allowUnknownQueryParameters: true,
        }, // (default)
        validateResponses: false, // false by default
      }),
    );
  }
}
