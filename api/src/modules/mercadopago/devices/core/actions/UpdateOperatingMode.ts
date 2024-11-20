import { DeviceId, OperatingMode } from '../domain/Device';
import { deviceService, DeviceService } from '../domain/DeviceService';

class UpdateOperatingMode {
  constructor(private deviceService: DeviceService) { }

  invoke(deviceId: DeviceId, mode: OperatingMode): Promise<void> {
    return this.deviceService.updateOperatingMode(deviceId, mode);
  }
}

export const updateOperatingMode = new UpdateOperatingMode(deviceService);
