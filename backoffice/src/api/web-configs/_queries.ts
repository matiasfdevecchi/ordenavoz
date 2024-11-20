import { HandledError } from "../utils/HandledError";
import { WebConfig, WebConfigProps } from "./WebConfig";

export const getWebConfig = async (accessToken: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/web-configs/unique`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();

    return WebConfig.fromJson(data);
}

export type UpdateWebConfigProps = Omit<WebConfigProps, "id">;

export const updateWebConfig = async (accessToken: string, props: UpdateWebConfigProps): Promise<WebConfig> => {
    const formData = new FormData();

    formData.append("backofficePrinterUrl", props.backofficePrinterUrl);
    formData.append("clientPrinterUrl", props.clientPrinterUrl);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/web-configs`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new HandledError(errorData);
    }

    const data = await response.json();
    return WebConfig.fromJson(data);
}