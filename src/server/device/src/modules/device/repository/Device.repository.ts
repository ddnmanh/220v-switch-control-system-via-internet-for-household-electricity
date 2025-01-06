import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DeviceEntity, { DeviceType } from 'src/entity/Device.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';

@Injectable()
export class DeviceRepository {

    constructor(
        @InjectRepository(DeviceEntity)
        private readonly deviceRepository: Repository<DeviceEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async getDeviceById(deviceId: string): Promise<DeviceEntity | null> {
        return this.deviceRepository.findOne({ where: { id: deviceId } });
    }

    // async createOne(firstname: string, lastname: string, username: string, email: string, role: UserRole): Promise<DeviceEntity> {
    //     let user = new DeviceEntity();
    //     // Tạo ID cho user trước khi lưu vào DB
    //     user.id = this.generateUUIDService.generateIdWithLength(6);
    //     user.firstname = firstname;
    //     user.lastname = lastname;
    //     user.username = username;
    //     user.email = email;
    //     user.role = role;
    //     return this.deviceRepository.save(user);
    // }

    // async findOneById(id: string): Promise<DeviceEntity | null> {
    //     return this.deviceRepository.findOne({ where: { id: id }  });
    // }

    // async findOneByUsername(usn: string = ''): Promise<DeviceEntity | null> {
    //     return await this.deviceRepository
    //         .createQueryBuilder('user')
    //         .leftJoinAndSelect(
    //             'user.userPassword',
    //             'userPassword',
    //             'userPassword.isActive = :isActive', // Điều kiện where cho mối quan hệ
    //             { isActive: true }
    //         )
    //         .where('user.username = :username', { username: usn })
    //         .andWhere('user.isDelete = :isDelete', { isDelete: false })
    //         .getOne();
    // }

    // async findOneByEmail(email: string = ''): Promise<DeviceEntity | null> {
    //     return this.deviceRepository.findOne({ where: { email: email } });
    // }

    // async countUserByUsername(username: string): Promise<number> {
    //     return await this.deviceRepository.count({ where: { username: username } });
    // }

    // async countUserByEmail(email: string): Promise<number> {
    //     return await this.deviceRepository.count({ where: { email: email } });
    // }
}
