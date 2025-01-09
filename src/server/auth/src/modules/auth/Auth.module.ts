
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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HOUSE_PACKAGE_NAME, HOUSE_SERVICE_NAME } from 'src/proto/house.pb';
import { join } from 'path';
import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';

@Module({
    imports: [
        CommonModule,
        ClientsModule.register([
            {
                name: HOUSE_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: 'localhost:50053',
                    package: HOUSE_PACKAGE_NAME,
                    protoPath: join(__dirname, '../../../node_modules/config-project-global/proto/house.proto'),
                    credentials: grpc.credentials.createSsl(
                        fs.readFileSync(join(__dirname, '../../../node_modules/config-project-global/mTLS/RootCA.pem')),  // CA Root
                        fs.readFileSync(join(__dirname, '../../../mTLS/authService.key')),  // Private key client
                        fs.readFileSync(join(__dirname, '../../../mTLS/authService.crt')),  // Chứng chỉ client
                    ),
                },
            },
        ]),
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
