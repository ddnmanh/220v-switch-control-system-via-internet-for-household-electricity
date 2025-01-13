import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';
import RoomEntity from 'src/entity/Room.entity';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';

@Injectable()
export class RoomRepository {

    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,

        @InjectRepository(OwnDeviceEntity)
        private readonly ownDeviceRepository: Repository<OwnDeviceEntity>,

        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createRoom(newRoom: RoomEntity): Promise<RoomEntity> {

        newRoom.id = this.generateUUIDService.generateIdWithLength(6); // Generate UUID

        return await this.roomRepository.save(newRoom);
    }

    /**
     * Lấy room cùng với danh sách ownDevice thuộc về room đó.
     * @param roomId ID của room.
     * @returns Room kèm theo danh sách ownDevice liên kết, hoặc null nếu không tìm thấy.
     */
    async getRoomWithOwnDevices(roomId: string): Promise<RoomEntity | null> {
        return await this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.ownDevices', 'ownDevice') // Liên kết với ownDevices
            .where('room.id = :roomId', { roomId }) // Điều kiện cho room ID
            .andWhere('room.isDelete = false') // Kiểm tra room không bị xóa
            .andWhere('ownDevice.isDelete = false')
            .getOne();
    }

    async isRoomBelongToUser(roomId: string, userId: string): Promise<boolean> {
        const room = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.house', 'house')
            .where('room.id = :roomId', { roomId })
            .andWhere('house.idUser = :userId', { userId })
            .andWhere('room.isDelete = false')
            .andWhere('house.isDelete = false')
            .getOne();

        return !!room;
    }

    async getRoomById(roomId: string): Promise<RoomEntity | null> {
        return await this.roomRepository.findOne({ where: { id: roomId, isDelete: false } });
    }

    async updateRoom(room: RoomEntity): Promise<RoomEntity> {
        return await this.roomRepository.save(room);
    }

    public async softDeleteRoomWithRelations(idRoom: string): Promise<void> {
        const queryRunner = this.roomRepository.manager.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Cập nhật isDelete = true cho room
            await queryRunner.manager
                .createQueryBuilder()
                .update('rooms')
                .set({ isDelete: true })
                .where('id = :idRoom', { idRoom })
                .execute();

            // Cập nhật isDelete = true cho ownDevices thuộc room
            await queryRunner.manager
                .createQueryBuilder()
                .update('own_devices')
                .set({ isDelete: true })
                .where('id_room = :idRoom', { idRoom })
                .execute();

            // Commit transaction nếu không có lỗi
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback transaction nếu xảy ra lỗi
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to soft delete room and its relations: ${error.message}`);
        } finally {
            // Đóng query runner
            await queryRunner.release();
        }
    }

    public async countOwnDeviceInRoom(roomId: string, idUser: string): Promise<number> {
        return await this.ownDeviceRepository
            .createQueryBuilder('ownDevice')
            .leftJoinAndSelect('ownDevice.room', 'room') // Liên kết với ownDevices
            .leftJoinAndSelect('room.house', 'house')
            .where('room.id = :roomId', { roomId }) // Điều kiện cho room ID
            .andWhere('house.idUser = :idUser', { idUser })
            .andWhere('house.isDelete = false')
            .andWhere('room.isDelete = false')
            .andWhere('ownDevice.isDelete = false')
            .getCount();
    }

    async deleteRoom(roomId: string): Promise<void> {
        await this.roomRepository.update({ id: roomId }, { isDelete: true });
    }

    async isRoomBelongToHouse(roomId: string, houseId: string): Promise<boolean> {
        const room = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.house', 'house')
            .where('room.id = :roomId', { roomId })
            .andWhere('house.id = :houseId', { houseId })
            .andWhere('room.isDelete = false')
            .andWhere('house.isDelete = false')
            .getOne();

        return !!room;
    }

}
