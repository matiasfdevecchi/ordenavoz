import { Order } from "../../orders/core/domain/Order";
import { webConfigRepository } from "../../web-config/core/domain/WebConfigRepository";
import { AxiosPrinterService } from "../infrastructure/AxiosPrinterService";

export interface PrinterService {
    printOrder(order: Order, printer: 'backoffice' | 'client', paymentPending: boolean): Promise<void>;
}

export const printerService = new AxiosPrinterService(webConfigRepository);