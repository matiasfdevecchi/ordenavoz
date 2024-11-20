import { FC } from "react";
import { Device, OperatingMode } from "../../../../../api/mercadopago/devices/Device";

type Props = {
    device: Device;
    handlePay: (device: Device) => void;
    loadingDevice: Device | undefined;
}

const CustomActions: FC<Props> = ({ device, handlePay, loadingDevice }) => {

    if (loadingDevice && loadingDevice.id !== device.id) {
        return null;
    }

    return <div>
        {
            device.operatingMode == OperatingMode.PDV && <button
                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-3'
                onClick={() => handlePay(device)}
            >
                {
                    loadingDevice && loadingDevice.id === device.id
                        ? <span className='spinner-border spinner-border-sm align-middle'></span>
                        : <i className='fa fa-usd'></i>
                }
            </button>
        }
    </div>;
}

export default CustomActions;