import { getAllMercadoPagoStores } from "../../../../../modules/mercadopago/stores/core/action/GetAllMercadoPagoStores";
import { getMpUserId } from "../../../utils/Functions";
import Controller from "../../controller";

export const getAllMercadoPagoStoresController: Controller = async (req, res) => {
    const stores = await getAllMercadoPagoStores.invoke(getMpUserId(req));

    res.status(200).json(stores);
}