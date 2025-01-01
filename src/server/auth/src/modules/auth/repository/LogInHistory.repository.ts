import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogInDto } from 'src/DTO/auth.dto';
import LogInHistoryEntity from 'src/entity/LogInHistory.entity';
import UserEntity from 'src/entity/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogInHistoryRepository {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(LogInHistoryEntity)
        private readonly logInHistoryRepository: Repository<LogInHistoryEntity>,
    ) { }

    // Phương thức lưu một bản ghi lịch sử đăng nhập
    async saveOne(user: UserEntity, token: string, otherData: LogInDto): Promise<LogInHistoryEntity> {
        let logInHistoryEntity = new LogInHistoryEntity();

        logInHistoryEntity.user = user;
        logInHistoryEntity.token = token;
        logInHistoryEntity.latitude = otherData.latitude;
        logInHistoryEntity.longitude = otherData.longitude;

        return this.logInHistoryRepository.save(logInHistoryEntity);
    }

    // Cập nhật tất cả các bản ghi lịch sử đăng nhập của người dùng với isExpired = true
    async updateExpiredOldLogInHistory(user: UserEntity): Promise<void> {

        const result = await this.logInHistoryRepository
            .createQueryBuilder()
            .update(LogInHistoryEntity)
            .set({ isExpired: true })
            .where("user.id = :userId", { userId: user.id })
            .andWhere("isExpired = false")
            .execute();

        if (result.affected === 0) {
            console.log('Không có lịch sử đăng nhập nào để cập nhật!');
        }
    }

    async softDeleteRefreshToken(token: string): Promise<void> {
        await this.logInHistoryRepository
            .createQueryBuilder()
            .update(LogInHistoryEntity)
            .set({ isExpired: true })
            .where("token = :token", { token })
            .execute();
    }

    async findOneByToken(token: string): Promise<LogInHistoryEntity | null> {
        return await this.logInHistoryRepository.findOne({
            where: {
                token: token,
                isExpired: false,
            },
        });
    }

}
