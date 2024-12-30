
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import UserEntity from '../../../entity/User.entity';
import RefreshTokenEntity from '../../../entity/LogInHistory.entity';
import PasswordHistoryEntity from 'src/entity/PasswordHistory.entity';
import LogInHistoryEntity from '../../../entity/LogInHistory.entity';
import UserRegiterEntity from 'src/entity/UserRegister.entity';
import OTPEntity from 'src/entity/OTP.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: configService.get<string>('database_type') as any,
                host: configService.get<string>('database_host'),
                port: +configService.get<number>('database_port'),
                username: configService.get<string>('database_username'),
                password: configService.get<string>('database_password'),
                database: configService.get<string>('database_name'),
                entities: [
                    UserEntity,
                    PasswordHistoryEntity,
                    LogInHistoryEntity,
                    UserRegiterEntity,
                    OTPEntity
                ],
                synchronize: true,
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}

