import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { EnvModule } from './env/env.module';
import { JwtService } from '@nestjs/jwt';
import { MyConfigModule } from './config/config.module';
import { EmailModule } from './email/email.module';
import { GenerateUUIDModule } from './generate-uuid/generateUUID.module';

@Module({
    imports: [
        MyConfigModule,
        EnvModule,
        DatabaseModule,
        EncryptModule,
        EmailModule,
        GenerateUUIDModule
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
        EmailModule,
        GenerateUUIDModule
    ],
})

export class CommonModule {}
