import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';
import AreaEntity from 'src/entity/Area.entity';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';

@Injectable()
export class AreaRepository {

    constructor(
        @InjectRepository(AreaEntity)
        private readonly areaRepository: Repository<AreaEntity>,

        @InjectRepository(OwnDeviceEntity)
        private readonly ownDeviceRepository: Repository<OwnDeviceEntity>,

        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createArea(newArea: AreaEntity): Promise<AreaEntity> {

        newArea.id = this.generateUUIDService.generateIdWithLength(6); // Generate UUID

        return await this.areaRepository.save(newArea);
    }

    /**
     * Lấy area cùng với danh sách ownDevice thuộc về area đó.
     * @param areaId ID của area.
     * @returns Area kèm theo danh sách ownDevice liên kết, hoặc null nếu không tìm thấy.
     */
    async getAreaWithOwnDevices(areaId: string): Promise<AreaEntity | null> {
        return await this.areaRepository
            .createQueryBuilder('area')
            .leftJoinAndSelect('area.ownDevices', 'ownDevice') // Liên kết với ownDevices
            .where('area.id = :areaId', { areaId }) // Điều kiện cho area ID
            .andWhere('area.isDelete = false') // Kiểm tra area không bị xóa
            .andWhere('ownDevice.isDelete = false')
            .getOne();
    }

    async isAreaBelongToUser(areaId: string, userId: string): Promise<boolean> {
        const area = await this.areaRepository
            .createQueryBuilder('area')
            .leftJoin('area.house', 'house')
            .where('area.id = :areaId', { areaId })
            .andWhere('house.idUser = :userId', { userId })
            .andWhere('area.isDelete = false')
            .andWhere('house.isDelete = false')
            .getOne();

        return !!area;
    }

    async getAreaById(areaId: string): Promise<AreaEntity | null> {
        return await this.areaRepository.findOne({ where: { id: areaId, isDelete: false } });
    }

    async updateArea(area: AreaEntity): Promise<AreaEntity> {
        return await this.areaRepository.save(area);
    }

    public async softDeleteAreaWithRelations(idArea: string): Promise<void> {
        const queryRunner = this.areaRepository.manager.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Cập nhật isDelete = true cho area
            await queryRunner.manager
                .createQueryBuilder()
                .update('areas')
                .set({ isDelete: true })
                .where('id = :idArea', { idArea })
                .execute();

            // Cập nhật isDelete = true cho ownDevices thuộc area
            await queryRunner.manager
                .createQueryBuilder()
                .update('own_devices')
                .set({ isDelete: true })
                .where('id_area = :idArea', { idArea })
                .execute();

            // Commit transaction nếu không có lỗi
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback transaction nếu xảy ra lỗi
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to soft delete area and its relations: ${error.message}`);
        } finally {
            // Đóng query runner
            await queryRunner.release();
        }
    }

    public async countOwnDeviceInArea(areaId: string, idUser: string): Promise<number> {
        return await this.ownDeviceRepository
            .createQueryBuilder('ownDevice')
            .leftJoinAndSelect('ownDevice.area', 'area') // Liên kết với ownDevices
            .leftJoinAndSelect('area.house', 'house')
            .where('area.id = :areaId', { areaId }) // Điều kiện cho area ID
            .andWhere('house.idUser = :idUser', { idUser })
            .andWhere('house.isDelete = false')
            .andWhere('area.isDelete = false')
            .andWhere('ownDevice.isDelete = false')
            .getCount();
    }

    async deleteArea(areaId: string): Promise<void> {
        await this.areaRepository.update({ id: areaId }, { isDelete: true });
    }

}
