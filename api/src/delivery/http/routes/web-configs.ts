import { createOrUpdateWebConfig } from "../../../modules/web-config/core/actions/CreateOrUpdateWebConfig";
import { getWebConfig } from "../../../modules/web-config/core/actions/GetWebConfig";
import Controller from "./controller";

export const createOrUpdateWebConfigController: Controller = async (req, res) => {
    const { backofficePrinterUrl, clientPrinterUrl } = req.body;

    const webConfig = await createOrUpdateWebConfig.invoke({
        backofficePrinterUrl,
        clientPrinterUrl,
    });
    res.status(201).json(webConfig);
}

export const getWebConfigController: Controller = async (_, res) => {
    const wc = await getWebConfig.invoke();
    res.status(200).json(wc);
}