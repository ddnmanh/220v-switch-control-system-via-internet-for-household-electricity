import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserRegiterEntity from 'src/entity/UserRegister.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';
import PasswordHistoryEntity from 'src/entity/PasswordHistory.entity';
import UserEntity from 'src/entity/User.entity';

@Injectable()
export class PasswordHistoryRepository {

    constructor(
        @InjectRepository(PasswordHistoryEntity)
        private readonly userRepository: Repository<PasswordHistoryEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createOne(user: UserEntity, password: string): Promise<PasswordHistoryEntity> {
        let passHis = new PasswordHistoryEntity();
        passHis.user = user;
        passHis.password = password;
        return this.userRepository.save(passHis);
    }

    async updateNoActiveOldPass(user: UserEntity): Promise<PasswordHistoryEntity[]> {
        let passHis: PasswordHistoryEntity[] = await this.userRepository.find({
            where: {
                user: { id: user.id },
                isActive: true
            }
        });

        // Cập nhật isActive cho từng bản ghi
        passHis.forEach((pass) => {
            pass.isActive = false;
        });

        return this.userRepository.save(passHis);
    }
}
