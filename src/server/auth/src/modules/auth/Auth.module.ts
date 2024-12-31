
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/Auth.service';
import { AutController } from './Auth.controller';
import { CommonModule } from '../common/common.module';
import { UserRepository } from './repository/User.repository';
import UserEntity from 'src/entity/User.entity';
import { LogInHistoryRepository } from './repository/LogInHistory.repository';
import { JWTService } from './service/JWT.service';
import PasswordHistoryEntity from 'src/entity/PasswordHistory.entity';
import LogInHistoryEntity from 'src/entity/LogInHistory.entity';
import UserRegiterEntity from 'src/entity/UserRegister.entity';
import OTPEntity from 'src/entity/OTP.entity';
import { UserRegisterRepository } from './repository/UserRegister.repository';
import { OTPRepository } from './repository/OTP.repository';
import { PasswordHistoryRepository } from './repository/PasswordHistory.repository';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            UserEntity, PasswordHistoryEntity,
            LogInHistoryEntity, UserRegiterEntity,
            OTPEntity
        ]),
    ],
    providers: [
        AuthService,
        JWTService,
        UserRepository,
        LogInHistoryRepository,
        UserRegisterRepository,
        OTPRepository,
        PasswordHistoryRepository
    ],
    controllers: [AutController],
    exports: [
        AuthService,
        JWTService,
        UserRepository,
        TypeOrmModule
    ],
})
export class AuthModule {}
