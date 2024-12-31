import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    async saveOne(user: UserEntity, token: string): Promise<LogInHistoryEntity> {
        let logInHistoryEntity = new LogInHistoryEntity();

        logInHistoryEntity.user = user;
        logInHistoryEntity.token = token;

        return this.logInHistoryRepository.save(logInHistoryEntity);
    }

    // Cập nhật tất cả các bản ghi lịch sử đăng nhập của người dùng với isExpired = true
    async updateExpiredOldLogInHistory(user: UserEntity): Promise<void> {
        // // Lấy tất cả lịch sử đăng nhập của người dùng, chỉ các bản ghi chưa hết hạn
        // let logInHistoryEntities: LogInHistoryEntity[] = await this.logInHistoryRepository.find({
        //     where: {
        //         user: { id: user.id }, // Sử dụng id người dùng để kiểm tra
        //         isExpired: false
        //     },
        //     relations: ['user'] // Đảm bảo rằng quan hệ 'user' được tải
        // });

        // // Nếu không tìm thấy bản ghi, log thông báo để kiểm tra
        // if (logInHistoryEntities.length === 0) {
        //     console.log('Không có lịch sử đăng nhập nào để cập nhật!');
        // }

        // // Cập nhật isExpired cho từng bản ghi
        // logInHistoryEntities.forEach((logInHistory) => {
        //     logInHistory.isExpired = true;
        // });

        // // Lưu lại các bản ghi đã được cập nhật
        // return this.logInHistoryRepository.save(logInHistoryEntities);

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
}
