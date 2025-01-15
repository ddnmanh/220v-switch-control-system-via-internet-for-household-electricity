import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DeviceEntity, { DeviceType } from 'src/entity/Device.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';
import DeviceAPEntity from 'src/entity/DeviceAP.entity';

@Injectable()
export class DeviceRepository {

    constructor(
        @InjectRepository(DeviceEntity)
        private readonly deviceRepository: Repository<DeviceEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createDevice(newDevice: DeviceEntity): Promise<DeviceEntity> {
        newDevice.id = this.generateUUIDService.generateIdWithLength(6);
        newDevice.deviceAP.apSSID = newDevice.type == DeviceType.SWITCH ? (newDevice.id + '_WIFI') : newDevice.id;
        return await this.deviceRepository.save(newDevice);
    }

    async getDeviceById(deviceId: string): Promise<DeviceEntity | null> {
        return await this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.deviceAP', 'deviceAP')
            .where('device.id = :id', { id: deviceId })
            .getOne();
    }

    async updateDevice(deviceUpdate: DeviceEntity): Promise<DeviceEntity | null> {
        return await this.deviceRepository.save(deviceUpdate);
    }

    async deleteDeviceById(deviceId: string): Promise<boolean> {
        let device = await this.deviceRepository.findOne({ where: { id: deviceId } });
        if (!device) {
            return false;
        }
        await this.deviceRepository.remove(device);
        return true;
    }
}
