import { Application, Request, Response } from 'express';
import { validateAuthorizationMiddleware } from './middlewares/Authorization';
import { defaultController } from './routes/controller';
import { createCategoryController, deleteCategoryController, getAllCategoriesController, updateCategoryController } from './routes/categories';
import { getAllProductsController, createProductController, updateProductController, deleteProductController, getProductByIdController } from './routes/products';
import { changePasswordController, createUserController, deleteUserController, getAllUsersController, replaceRoleController, resetPasswordController } from './routes/users';
import { TypeormConnectionManager } from '../../modules/shared/infrastructure/typeorm/TypeormConnectionManager';
import { createIngredientController, deleteIngredientController, getAllIngredientsController, updateIngredientController } from './routes/ingredients';
import { createOrderController, generateMercadoPagoDynamicQRController, generateMercadoPagoPointPaymentIntentController, generateMercadoPagoQRController, getAllOrdersController, getOrderByIdController, payOrderByCashController, updateOrderController } from './routes/orders';
import { getAllMercadoPagoStoresController } from './routes/mercadopago/services/stores';
import { getAllMercadoPagoCashiersController } from './routes/mercadopago/services/cashiers';
import { createStoreController, deleteStoreController, getAllStoresController } from './routes/mercadopago/stores';
import { createCashierController, deleteCashierController, getAllCashiersController } from './routes/mercadopago/cashiers';
import validateMercadoPagoWebhookMiddleware from './middlewares/ValidateMercadoPagoWebhook';
import { listenMercadoPagoController } from './routes/mercadopago';
import { consultByAudioController, consultByTextController } from './routes/client-assitance';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import multer from 'multer';
import { cancelPaymentIntentController, createPaymentIntentController, getAllDevicesController, updateOperatingModeController } from './routes/mercadopago/devices';
import { orderNotifier } from '../../modules/orders/core/domain/OrderNotifier';
import { createOrUpdateWebConfigController, getWebConfigController } from './routes/web-configs';
import {GoogleCloudTTSClient} from "../../modules/client-assistance/infrastructure/GoogleTTSClient";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Obtiene la extensión del archivo original
    const filename = `${file.fieldname}-${Date.now()}${ext}`; // Genera un nuevo nombre con la extensión original
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

const { version } = require('../../../package.json');


async function textToSpeech(text: string, outputPath: string): Promise<string> {
  const client = new GoogleCloudTTSClient();

  // Genera el audio con Google Text-to-Speech y guarda el archivo en la ubicación indicada
  const outputFilePath = path.resolve(outputPath);
  await client.saveAudioToFile(text, outputFilePath);

  return outputFilePath;
}

// Esto se va a usar en el cliente
async function convertBase64ToMp3(base64String: string, outputFilePath: string): Promise<string> {
  const audioBuffer = Buffer.from(base64String, 'base64');
  const absolutePath = path.resolve(outputFilePath); // Asegura que sea una ruta absoluta
  await fs.promises.writeFile(absolutePath, audioBuffer);
  return absolutePath;
}

async function handleRequest(responseText: string): Promise<string> {

  // Convierte el texto a audio
  const audioFilePath = await textToSpeech(responseText, 'output/response.mp3');

  return audioFilePath;
}

const healthCheckController = async (_: Request, res: Response) => {
  const isHealth = await TypeormConnectionManager.healthCheck();
  res.status(isHealth ? 200 : 500).send(isHealth ? 'OK' : 'NOT OK');
}

export const setupRoutes = (app: Application): void => {
  app.get('/', (_: Request, res: Response) => {
    res.send(`${process.env.VERSION_PREFIX || 'unknown'}-${version}`);
  });

  app.post('/speech-to-text', upload.single('audio'), async (req: Request, res: Response) => {
    try {
      // Verifica que el archivo exista
      if (!req.file) {
        return res.status(400).send("No se subió ningún archivo de audio.");
      }

      // Path al archivo de audio subido
      const audioPath = path.resolve(req.file.path);

      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Realiza la transcripción usando Whisper de OpenAI
      const response = await client.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: 'whisper-1',
      });

      // Elimina el archivo después de la transcripción
      fs.unlink(audioPath, (err) => {
        if (err) console.error("Error al eliminar el archivo:", err);
      });

      // Envía la transcripción como respuesta
      res.json({ transcription: response.text });

    } catch (error) {
      console.error("Error al transcribir el audio:", error);
      res.status(500).send("Error al procesar la transcripción.");
    }
  });

  app.get('/text-to-speech', async (req: Request, res: Response) => {
    try {
      const audioPath = await handleRequest(req.query.text as string);

      // Leer el archivo MP3 y codificarlo en Base64
      const audioBuffer = fs.readFileSync(audioPath);
      const audioBase64 = audioBuffer.toString('base64');

      const file = await convertBase64ToMp3(audioBase64, 'output/response1.mp3');
      res.sendFile(file, (err) => {
        if (err) {
          console.error("Error al enviar el archivo:", err);
          res.status(500).send("Error al enviar el archivo.");
        } else {
          // Eliminar el archivo después de enviarlo
          fs.unlink(file, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error al eliminar el archivo:", unlinkErr);
            } else {
              console.log("Archivo temporal eliminado:", file);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res.status(500).send("Error al procesar la solicitud.");
    }
  });

  app.get('/other-2', defaultController(async (_: Request, res: Response) => {
    orderNotifier.notifyMercadoPagoPayment(50);
  }));

  app.get('/health-2', healthCheckController);

  app.get('/health', defaultController(healthCheckController));

  // Public endpoints
  app.post('/mercado-pago-webhook', validateMercadoPagoWebhookMiddleware, defaultController(listenMercadoPagoController));
  app.get('/categories', defaultController(getAllCategoriesController));
  app.get('/orders', defaultController(getAllOrdersController));
  app.post('/orders', defaultController(createOrderController));
  app.get('/products', defaultController(getAllProductsController));
  app.get('/products/:productId', defaultController(getProductByIdController));

  // Client Assistance
  app.post('/client-assistance/text', defaultController(consultByTextController));
  app.post('/client-assistance/audio', upload.single('audio'), defaultController(consultByAudioController));

  app.use('/', validateAuthorizationMiddleware);

  // Categories
  app.post('/categories', defaultController(createCategoryController));
  app.patch('/categories/:categoryId', defaultController(updateCategoryController));
  app.delete('/categories/:categoryId', defaultController(deleteCategoryController));


  // Ingredients
  app.get('/ingredients', defaultController(getAllIngredientsController));
  app.post('/ingredients', defaultController(createIngredientController));
  app.patch('/ingredients/:ingredientId', defaultController(updateIngredientController));
  app.delete('/ingredients/:ingredientId', defaultController(deleteIngredientController));

  // Mercado Pago
  app.get('/mercadopago/devices', defaultController(getAllDevicesController));
  app.patch('/mercadopago/devices/:mpDeviceId/operating-mode', defaultController(updateOperatingModeController));
  app.post('/mercadopago/devices/:mpDeviceId/payment-intents', defaultController(createPaymentIntentController));
  app.delete('/mercadopago/devices/:mpDeviceId/payment-intents/:mpPaymentIntentId', defaultController(cancelPaymentIntentController));

  app.get('/mercadopago/stores', defaultController(getAllStoresController));
  app.post('/mercadopago/stores', defaultController(createStoreController));
  app.delete('/mercadopago/stores/:mpStoreId', defaultController(deleteStoreController));

  app.get('/mercadopago/cashiers', defaultController(getAllCashiersController));
  app.post('/mercadopago/cashiers', defaultController(createCashierController));
  app.delete('/mercadopago/cashiers/:mpCashierId', defaultController(deleteCashierController));

  // Mercado Pago Services
  app.get('/mercadopago-services/:mpUserId/stores', defaultController(getAllMercadoPagoStoresController));
  app.get('/mercadopago-services/stores/:mpStoreId/cashiers', defaultController(getAllMercadoPagoCashiersController));

  // Orders
  app.get('/orders/:orderId', defaultController(getOrderByIdController));
  app.patch('/orders/:orderId', defaultController(updateOrderController));
  app.post('/orders/:orderId/pay', defaultController(payOrderByCashController));
  app.post('/orders/:orderId/pay-mercadopago-qr', defaultController(generateMercadoPagoQRController));
  app.post('/orders/:orderId/pay-mercadopago-dynamic-qr', defaultController(generateMercadoPagoDynamicQRController));
  app.post('/orders/:orderId/pay-mercadopago-point', defaultController(generateMercadoPagoPointPaymentIntentController));


  // Products
  app.post('/products', defaultController(createProductController));
  app.patch('/products/:productId', defaultController(updateProductController));
  app.delete('/products/:productId', defaultController(deleteProductController));

  // Users
  app.get('/users', defaultController(getAllUsersController));
  app.post('/users', defaultController(createUserController));
  app.delete('/users/:userId', defaultController(deleteUserController));
  app.post('/users/:userId/reset-password', defaultController(resetPasswordController));
  app.post('/users/:userId/change-password', defaultController(changePasswordController));

  // Roles
  app.put('/users/:userId/roles', defaultController(replaceRoleController));

  // Web configs
  app.get('/web-configs/unique', defaultController(getWebConfigController));
  app.post('/web-configs', defaultController(createOrUpdateWebConfigController));
};