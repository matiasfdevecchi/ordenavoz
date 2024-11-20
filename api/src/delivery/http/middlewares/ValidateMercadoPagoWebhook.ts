import { createHmac } from "crypto";
import Middleware from "./middleware";
import logger from "../../../logger";

const validateMercadoPagoWebhookMiddleware: Middleware = async (req, res, next) => {
    // Obtener los encabezados de la solicitud
    const xSignature = req.headers['x-signature'] as string;
    const xRequestId = req.headers['x-request-id'];

    // Obtener los parámetros de la URL relacionados con la solicitud
    const dataID = req.query['data.id'];

    if (!xSignature || !xRequestId || !dataID) {
        res.status(400).send('Missing required headers or query parameters');
        return;
    }

    // Separar la x-signature en partes
    const parts = xSignature.split(',');

    // Inicializar variables para almacenar ts y hash
    let ts;
    let hash;

    // Iterar sobre los valores para obtener ts y v1
    parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'ts') {
                ts = trimmedValue;
            } else if (trimmedKey === 'v1') {
                hash = trimmedValue;
            }
        }
    });

    if (!ts || !hash) {
        res.status(400).send('Invalid x-signature format');
        return;
    }

    // Obtener la clave secreta para el usuario/aplicación del sitio de desarrolladores de Mercadopago
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET as string;

    // Generar el string de manifest
    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

    // Crear una firma HMAC
    const hmac = createHmac('sha256', secret);
    hmac.update(manifest);

    // Obtener el resultado del hash como una cadena hexadecimal
    const sha = hmac.digest('hex');

    if (sha === hash) {
        // Verificación HMAC exitosa
        next();
    } else {
        // Verificación HMAC fallida
        logger.error("HMAC verification failed");
        res.status(403).send('Invalid signature');
    }
}

export default validateMercadoPagoWebhookMiddleware;