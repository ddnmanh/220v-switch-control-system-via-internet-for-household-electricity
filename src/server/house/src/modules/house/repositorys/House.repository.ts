import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import HouseEntity from 'src/entity/House.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';

@Injectable()
export class HouseRepository {

    constructor(
        @InjectRepository(HouseEntity)
        private readonly houseRepository: Repository<HouseEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createHouse(newHouse: HouseEntity): Promise<HouseEntity> {

        newHouse.id = this.generateUUIDService.generateIdWithLength(6); // Generate UUID

        return await this.houseRepository.save(newHouse);
    }

    async getHouseByIdByIdUser(idUser: string, houseId: string): Promise<HouseEntity> {
        return await this.houseRepository.findOne({
            where: {
                id: houseId,
                idUser: idUser
            }
        });
    }


    public async getHouseWithRelationsByIdUser(houseId: string, idUser: string): Promise<HouseEntity | null> {
        return await this.houseRepository.createQueryBuilder('house')
            .leftJoinAndSelect('house.rooms', 'room', 'room.isDelete = false')
            .leftJoinAndSelect('room.ownDevices', 'roomDevice', 'roomDevice.isDelete = false')
            .leftJoinAndSelect('house.ownDevices', 'ownDevices', 'ownDevices.id_room IS NULL AND ownDevices.isDelete = false')
            .leftJoinAndSelect('house.setting', 'setting')
            .where('house.id = :houseId', { houseId })
            .andWhere('house.idUser = :idUser', { idUser })
            .andWhere('house.isDelete = false')
            .getOne();
    }

    async updateHouse(body: HouseEntity): Promise<HouseEntity> {
        return await this.houseRepository.save(body);
    }

    /**
     * Xoá house và các rooms thuộc house bằng cách cập nhật isDelete = true
     * @param houseId ID của house cần xoá
     * @param userId ID của user sở hữu house
     */
    public async softDeleteHouseWithRelations(houseId: string, userId: string): Promise<void> {
        const queryRunner = this.houseRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Cập nhật isDelete = true cho house
            await queryRunner.manager
                .createQueryBuilder()
                .update('houses')
                .set({ isDelete: true })
                .where('id = :houseId', { houseId })
                .andWhere('idUser = :userId', { userId })
                .execute();

            // Cập nhật isDelete = true cho rooms thuộc house
            await queryRunner.manager
                .createQueryBuilder()
                .update('rooms')
                .set({ isDelete: true })
                .where('id_house = :houseId', { houseId })
                .execute();

            // Cập nhật isDelete = true cho ownDevices thuộc house
            await queryRunner.manager
                .createQueryBuilder()
                .update('own_devices')
                .set({ isDelete: true })
                .where('id_house = :houseId', { houseId })
                .execute();

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to delete house and its rooms: ${error.message}`);
        } finally {
            // Kết thúc query runner
            await queryRunner.release();
        }
    }

    async isHouseBelongToUser(houseId: string, userId: string): Promise<boolean> {
        const house = await this.houseRepository.findOne({
            where: {
                id: houseId,
                idUser: userId
            }
        });

        return !!house;
    }

    async getAllHouseWithRelationsByIdUser(userId: string): Promise<HouseEntity[]> {
        return await this.houseRepository.createQueryBuilder('house')
            .leftJoinAndSelect('house.rooms', 'room', 'room.isDelete = false')
            .leftJoinAndSelect('room.ownDevices', 'device', 'device.isDelete = false')
            .leftJoinAndSelect('house.ownDevices', 'ownDevices', 'ownDevices.id_room IS NULL AND ownDevices.isDelete = false')
            .leftJoinAndSelect('house.setting', 'setting')
            .andWhere('house.idUser = :userId', { userId })
            .andWhere('house.isDelete = false')
            .getMany();
    }
}
