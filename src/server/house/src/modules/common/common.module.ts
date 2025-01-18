import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { MyConfigModule } from './config/config.module';
import { GenerateUUIDModule } from './generate-uuid/generateUUID.module';

@Module({
    imports: [
        MyConfigModule,
        EnvModule,
        DatabaseModule,
        GenerateUUIDModule
    ],
    controllers: [],
    providers: [
    ],
    exports: [
        MyConfigModule,
        EnvModule,
        DatabaseModule,
        GenerateUUIDModule
    ],
})

export class CommonModule {}
