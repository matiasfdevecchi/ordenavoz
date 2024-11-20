import { createOrder } from "../../../modules/orders/core/actions/CreateOrder";
import { generateMercadoPagoDynamicQR } from "../../../modules/orders/core/actions/GenerateMercadoPagoDynamicQR";
import { generateMercadoPagoPointPaymentIntent } from "../../../modules/orders/core/actions/GenerateMercadoPagoPointPayment";
import { generateMercadoPagoQR } from "../../../modules/orders/core/actions/GenerateMercadoPagoQR";
import { getAllOrders } from "../../../modules/orders/core/actions/GetAllOrders";
import { getOrderById } from "../../../modules/orders/core/actions/GetOrderById";
import { payOrderByCash } from "../../../modules/orders/core/actions/PayOrderByCash";
import { updateOrder } from "../../../modules/orders/core/actions/UpdateOrder";
import { OrderStatus } from "../../../modules/orders/core/domain/Order";
import { getOrderId, getPagination } from "../utils/Functions";
import Controller from "./controller";

export const getAllOrdersController: Controller = async (req, res) => {
    const orders = await getAllOrders.invoke({
        status: req.query.status as OrderStatus | undefined,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' | undefined,
        pagination: getPagination(req),
    });

    res.status(200).json(orders);
}

export const createOrderController: Controller = async (req, res) => {
    const { items, from, printPendingTicket } = req.body;

    const order = await createOrder.invoke(
        {
            items,
        },
        from || 'backoffice',
        printPendingTicket || false);
    res.status(201).json(order);
}

export const updateOrderController: Controller = async (req, res) => {
    const { status } = req.body;

    const order = await updateOrder.invoke(getOrderId(req), {
        status,
    });

    res.status(200).json(order);
}

export const getOrderByIdController: Controller = async (req, res) => {
    const order = await getOrderById.invoke(getOrderId(req));
    res.status(200).json(order);
}

export const payOrderByCashController: Controller = async (req, res) => {
    const { method, amount } = req.body;

    const order = await payOrderByCash.invoke(getOrderId(req), method, amount);

    res.status(200).json(order);
}

export const generateMercadoPagoQRController: Controller = async (req, res) => {
    const { cashierId } = req.body;

    await generateMercadoPagoQR.invoke(getOrderId(req), cashierId);

    res.status(204).send();
}

export const generateMercadoPagoDynamicQRController: Controller = async (req, res) => {
    const qrData = await generateMercadoPagoDynamicQR.invoke(getOrderId(req));

    res.status(200).send(qrData);
}

export const generateMercadoPagoPointPaymentIntentController: Controller = async (req, res) => {
    const { deviceId } = req.body;

    const id = await generateMercadoPagoPointPaymentIntent.invoke(getOrderId(req), deviceId);

    res.status(201).send({ id });
}