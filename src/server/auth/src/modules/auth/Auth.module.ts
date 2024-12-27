
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/Auth.service'; 
import { AutController } from './Auth.controller';  
import { CommonModule } from '../common/common.module';
import { UserRepository } from './repository/User.repository';
import UserEntity from 'src/entity/User.entity';
import RefreshTokenEntity from 'src/entity/RefreshToken.entity';
import { RefreshTokenRepository } from './repository/RefreshToken.repository';
import { JWTService } from './service/JWT.service';

@Module({
    imports: [ 
        CommonModule, 
        TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity]),
    ],
    providers: [
        AuthService,
        JWTService,
        UserRepository,
        RefreshTokenRepository,
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