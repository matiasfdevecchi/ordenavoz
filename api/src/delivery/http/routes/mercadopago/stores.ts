import { createStore } from "../../../../modules/mercadopago/stores/core/action/CreateStore";
import { deleteStore } from "../../../../modules/mercadopago/stores/core/action/DeleteStore";
import { getAllStores } from "../../../../modules/mercadopago/stores/core/action/GetAllStores";
import { getMpStoreId } from "../../utils/Functions";
import Controller from "../controller";

export const getAllStoresController: Controller = async (req, res) => {
    const stores = await getAllStores.invoke();

    res.status(200).json(stores);
}

export const createStoreController: Controller = async (req, res) => {
    const { mpUserId, storeId, externalId } = req.body;

    const store = await createStore.invoke(mpUserId, storeId, externalId);

    res.status(201).send(store);
}

export const deleteStoreController: Controller = async (req, res) => {
    const store = await deleteStore.invoke(getMpStoreId(req));
    res.status(200).json(store);
}