import { cancelPaymentIntent } from "../../../../modules/mercadopago/devices/core/actions/CancelPaymentIntent";
import { createPaymentIntent } from "../../../../modules/mercadopago/devices/core/actions/CreatePaymentIntent";
import { getAllDevices } from "../../../../modules/mercadopago/devices/core/actions/GetAllDevices";
import { updateOperatingMode } from "../../../../modules/mercadopago/devices/core/actions/UpdateOperatingMode";
import { getMpDeviceId, getMpPaymentIntentId, getPagination } from "../../utils/Functions";
import Controller from "../controller";

export const getAllDevicesController: Controller = async (req, res) => {
    const devices = await getAllDevices.invoke({
        pagination: getPagination(req),
    });

    res.status(200).json(devices);
}

export const updateOperatingModeController: Controller = async (req, res) => {
    await updateOperatingMode.invoke(getMpDeviceId(req), req.body.operatingMode);

    res.status(204).send();
}

export const createPaymentIntentController: Controller = async (req, res) => {
    const id = await createPaymentIntent.invoke(
        getMpDeviceId(req),
        req.body.amount,
        req.body.ticketNumber,
        req.body.externalReference
    );

    res.status(201).json({ id });
}

export const cancelPaymentIntentController: Controller = async (req, res) => {
    await cancelPaymentIntent.invoke(getMpDeviceId(req), getMpPaymentIntentId(req));

    res.status(204).send();
}