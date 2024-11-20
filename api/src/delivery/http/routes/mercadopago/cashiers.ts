import { createCashier } from "../../../../modules/mercadopago/cashiers/core/action/CreateCashier";
import { deleteCashier } from "../../../../modules/mercadopago/cashiers/core/action/DeleteCashier";
import { getAllCashiers } from "../../../../modules/mercadopago/cashiers/core/action/GetAllCashiers";
import { getMpCashierId } from "../../utils/Functions";
import Controller from "../controller";

export const getAllCashiersController: Controller = async (req, res) => {
    const cashiers = await getAllCashiers.invoke();

    res.status(200).json(cashiers);
}

export const createCashierController: Controller = async (req, res) => {
    const { storeId, cashierId, externalId } = req.body;

    const cashier = await createCashier.invoke(storeId, cashierId, externalId);

    res.status(201).send(cashier);
}

export const deleteCashierController: Controller = async (req, res) => {
    const cashier = await deleteCashier.invoke(getMpCashierId(req));
    res.status(200).json(cashier);
}