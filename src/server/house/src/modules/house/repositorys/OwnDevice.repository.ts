import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';

@Injectable()
export class OwnDeviceRepository {

    constructor(
        @InjectRepository(OwnDeviceEntity)
        private readonly ownDeviceRepository: Repository<OwnDeviceEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}


    async createOwnDevice(newOwnDevice: OwnDeviceEntity): Promise<OwnDeviceEntity> {
        return await this.ownDeviceRepository.save(newOwnDevice);
    }

    async isOwnDeviceBelongToUser(deviceId: string, userId: string): Promise<boolean> {
        const ownDevice = await this.ownDeviceRepository
            .createQueryBuilder('ownDevice')
            .leftJoin('ownDevice.house', 'house')
            .where('ownDevice.idDevice = :deviceId', { deviceId })
            .andWhere('house.idUser = :userId', { userId })
            .getOne();

        return !!ownDevice;
    }

    async isOwnDeviceExist(deviceId: string): Promise<boolean> {
        const ownDevice = await this.ownDeviceRepository.findOne({ where: { idDevice: deviceId, isDelete: false } });

        return !!ownDevice;
    }

    async deleteOwnDevice(deviceId: string): Promise<void> {
        await this.ownDeviceRepository.update({ idDevice: deviceId }, { isDelete: true });
    }

    async getOwnDeviceByIdDevice(deviceId: string): Promise<OwnDeviceEntity | null> {
        return await this.ownDeviceRepository.findOne({ where: { idDevice: deviceId, isDelete: false } });
    }

    async updateOwnDevice(updateOwnDevice: OwnDeviceEntity): Promise<OwnDeviceEntity> {
        return await this.ownDeviceRepository.save(updateOwnDevice);
    }
}
