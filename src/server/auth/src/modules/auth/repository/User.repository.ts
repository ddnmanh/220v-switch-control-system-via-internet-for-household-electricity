import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserRegiterEntity from 'src/entity/UserRegister.entity';
import UserEntity, { UserRole } from 'src/entity/User.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';

@Injectable()
export class UserRepository {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createOne(firstname: string, lastname: string, username: string, email: string, role: UserRole): Promise<UserEntity> {
        let user = new UserEntity();
        // Tạo ID cho user trước khi lưu vào DB
        user.id = this.generateUUIDService.generateIdWithLength(6);
        user.firstname = firstname;
        user.lastname = lastname;
        user.username = username;
        user.email = email;
        user.role = role;
        return this.userRepository.save(user);
    }

    async findOneById(id: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { id: id }  });
    }

    async findOneByUsername(usn: string = ''): Promise<UserEntity | null> {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect(
                'user.userPassword',
                'userPassword',
                'userPassword.isActive = :isActive', // Điều kiện where cho mối quan hệ
                { isActive: true }
            )
            .where('user.username = :username', { username: usn })
            .andWhere('user.isDelete = :isDelete', { isDelete: false })
            .getOne();
    }

    async findOneByEmail(email: string = ''): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email: email } });
    }

    async countUserByUsername(username: string): Promise<number> {
        return await this.userRepository.count({ where: { username: username } });
    }

    async countUserByEmail(email: string): Promise<number> {
        return await this.userRepository.count({ where: { email: email } });
    }
}
