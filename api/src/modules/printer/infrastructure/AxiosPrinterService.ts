import axios from 'axios';
import { Order } from "../../orders/core/domain/Order";
import { WebConfigRepository } from "../../web-config/core/domain/WebConfigRepository";
import { PrinterService } from "../domain/PrinterService";

interface PrintOrder {
    pending: boolean;
    id: number;
    date: string; // ISO string format
    total: number;
    items: PrintOrderItem[];
}

interface PrintOrderItem {
    product: {
        name: string;
    };
    price: number;
    variants: PrintOrderVariant[];
}

interface PrintOrderVariant {
    removedIngredients: RemovedIngredient[];
    quantity: number;
}

interface RemovedIngredient {
    ingredient: {
        name: string;
    };
    quantity: number;
}


export class AxiosPrinterService implements PrinterService {
    constructor(private readonly webConfigRepository: WebConfigRepository) { }

    async printOrder(order: Order, printer: 'backoffice' | 'client', paymentPending: boolean): Promise<void> {
        const webConfig = await this.webConfigRepository.get();
        if (webConfig === undefined) {
            throw new Error("Web config not found");
        }
        const url = printer === 'backoffice' ? webConfig.backofficePrinterUrl : webConfig.clientPrinterUrl;

        // Preparar el cuerpo de la solicitud
        const requestBody: PrintOrder = {
            pending: paymentPending,
            id: order.id,
            date: order.dateCreated.toISOString(),
            total: order.total,
            items: order.items.map(item => ({
                product: { name: item.product.name ?? 'Desconocido' },
                price: item.price,
                variants: item.variants.map(variant => ({
                    removedIngredients: variant.removedIngredients.map(ingredient => ({
                        ingredient: { name: ingredient.ingredient.name ?? 'Desconocido' },
                        quantity: ingredient.quantity,
                    })),
                    quantity: variant.quantity,
                })),
            })),
        };

        // Hacer la solicitud POST a la URL de la impresora
        try {
            await axios.post(`${url}/print-order`, requestBody);
            console.log('Orden enviada a la impresora con éxito');
        } catch (error) {
            console.error('Error al imprimir la orden:', error);
        }
    }
}
