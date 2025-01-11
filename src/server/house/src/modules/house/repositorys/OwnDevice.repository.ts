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
        newOwnDevice.id = this.generateUUIDService.generateIdWithLength(6);
        return await this.ownDeviceRepository.save(newOwnDevice);
    }

    async isOwnDeviceBelongToUser(ownDeviceId: string, userId: string): Promise<boolean> {
        const ownDevice = await this.ownDeviceRepository
            .createQueryBuilder('ownDevice')
            .leftJoin('ownDevice.house', 'house')
            .where('ownDevice.id = :ownDeviceId', { ownDeviceId })
            .andWhere('house.idUser = :userId', { userId })
            .andWhere('ownDevice.isDelete = false')
            .andWhere('house.isDelete = false')
            .getOne();

        return !!ownDevice;
    }

    async isDeviceUsing(deviceId: string): Promise<boolean> {
        const ownDevice = await this.ownDeviceRepository.findOne({ where: { idDevice: deviceId, isDelete: false } });
        return !!ownDevice;
    }

    async isOwnDeviceExist(deviceId: string): Promise<boolean> {
        const ownDevice = await this.ownDeviceRepository.findOne({ where: { idDevice: deviceId, isDelete: false } });
        return !!ownDevice;
    }

    async deleteOwnDevice(idOwnDevice: string): Promise<void> {
        await this.ownDeviceRepository.update({ id: idOwnDevice }, { isDelete: true });
    }

    async getOwnDeviceByIdOwnDevice(ownDeviceId: string, userId: string): Promise<OwnDeviceEntity | null> {
        return await this.ownDeviceRepository
            .createQueryBuilder('ownDevice')
            .leftJoin('ownDevice.house', 'house')
            .where('ownDevice.id = :ownDeviceId', { ownDeviceId })
            .andWhere('house.idUser = :userId', { userId })
            .andWhere('ownDevice.isDelete = false')
            .andWhere('house.isDelete = false')
            .getOne();
    }

    async updateOwnDevice(updateOwnDevice: OwnDeviceEntity): Promise<OwnDeviceEntity> {
        return await this.ownDeviceRepository.save(updateOwnDevice);
    }
}
