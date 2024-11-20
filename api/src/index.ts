import 'reflect-metadata';
import { config } from 'dotenv';
import { TypeormConnectionManager } from './modules/shared/infrastructure/typeorm/TypeormConnectionManager';

config();

TypeormConnectionManager.start().then(async () => {
  //este próximo import es lazing loading, para evitar que se instancien los repositorios sin que esté conectada la base de datos
  const { ExpressApp } = await import('./delivery/http/app');
  ExpressApp.getInstance().start();
});