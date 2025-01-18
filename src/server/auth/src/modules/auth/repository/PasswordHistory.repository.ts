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
        private readonly passwordHistoryEntity: Repository<PasswordHistoryEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createOne(user: UserEntity, password: string): Promise<PasswordHistoryEntity> {
        let passHis = new PasswordHistoryEntity();
        passHis.user = user;
        passHis.password = password;
        return this.passwordHistoryEntity.save(passHis);
    }

    // Phương thức cập nhật tất cả mật khẩu cũ của người dùng thành không hoạt động
    async updateNoActiveOldPass(user: UserEntity): Promise<number> {
        const result = await this.passwordHistoryEntity
            .createQueryBuilder()
            .update(PasswordHistoryEntity)
            .set({ isActive: false })
            .where('userId = :userId', { userId: user.id })
            .andWhere('isActive = true')
            .execute();

        if (result.affected === 0) {
            console.log('Không có bản ghi mật khẩu nào để cập nhật!');
        }

        // Trả về số bản ghi được cập nhật
        return result.affected || 0;
    }
}
