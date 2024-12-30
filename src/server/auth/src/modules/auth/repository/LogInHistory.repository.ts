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

    // success
    async createOne(userId: string, refreshTokenValue: string): Promise<LogInHistoryEntity> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                return new LogInHistoryEntity();
            }

            const refreshToken = new LogInHistoryEntity();
            refreshToken.user = user;
            refreshToken.token = refreshTokenValue;

            return await this.logInHistoryRepository.save<LogInHistoryEntity>(refreshToken);

        } catch (error) {
            return new LogInHistoryEntity();
        }
    }

    async findByUserIdAndToken(userId: string, refreshToken: string): Promise<LogInHistoryEntity | null> {
        return this.logInHistoryRepository.findOne({
            where: {
                user: { id: userId },
                token: refreshToken,
                isExpired: false,
            },
        });
    }

    async softDeleteRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.logInHistoryRepository.update(
            {
                user: { id: userId },
                token: refreshToken
            },
            { isExpired: true }
        );
    }
}
