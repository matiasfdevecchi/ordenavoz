import { StoreId } from "../../../stores/core/domain/Store";

export type DeviceId = string;

export enum OperatingMode {
    PDV = 'PDV',
    STANDALONE = 'STANDALONE',
}

export type DeviceProps = {
    id: DeviceId;
    posId: number;
    storeId: StoreId;
    externalPosId: string;
    operatingMode: OperatingMode;
}

export class Device {
    readonly id: DeviceId;
    readonly posId: number;
    readonly storeId: StoreId;
    readonly externalPosId: string;
    readonly operatingMode: OperatingMode;

    constructor({ id, posId, storeId, externalPosId, operatingMode }: DeviceProps) {
        this.id = id;
        this.posId = posId;
        this.storeId = storeId;
        this.externalPosId = externalPosId;
        this.operatingMode = operatingMode;
    }

    copy(props: Partial<DeviceProps>): Device {
        return new Device({
            ...this,
            ...props,
        });
    }
}