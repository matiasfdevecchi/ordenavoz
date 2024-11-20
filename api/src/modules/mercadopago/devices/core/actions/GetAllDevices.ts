import { EntriesResult } from '../../../../shared/domain/EntriesResult';
import { Device } from '../domain/Device';
import { deviceService, DeviceService, GetAllParams } from '../domain/DeviceService';

class GetAllDevices {
  constructor(private deviceService: DeviceService) { }

  invoke(params: GetAllParams): Promise<EntriesResult<Device>> {
    return this.deviceService.getAll(params);
  }
}

export const getAllDevices = new GetAllDevices(deviceService);
