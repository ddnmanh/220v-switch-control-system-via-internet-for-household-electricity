import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { EnvModule } from './env/env.module';
import { JwtService } from '@nestjs/jwt';
import { MyConfigModule } from './config/config.module';

@Module({
    imports: [
        MyConfigModule,
        EnvModule,
        DatabaseModule,
        EncryptModule,
    ],
    controllers: [],
    providers: [
        JwtService
    ],
    exports: [
        MyConfigModule,
        EnvModule,
        DatabaseModule,
        EncryptModule,
        JwtService,
    ],
})

export class CommonModule {}
