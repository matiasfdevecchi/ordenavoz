import { getAllMercadoPagoCashiers } from "../../../../../modules/mercadopago/cashiers/core/action/GetAllMercadoPagoCashiers";
import { getMpStoreId } from "../../../utils/Functions";
import Controller from "../../controller";

export const getAllMercadoPagoCashiersController: Controller = async (req, res) => {
    const cashiers = await getAllMercadoPagoCashiers.invoke(getMpStoreId(req));
    res.status(200).json(cashiers);
}