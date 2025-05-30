
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';
import RoomEntity from 'src/entity/Room.entity';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';

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
                    HouseEntity,
                    SettingEntity,
                    RoomEntity,
                    OwnDeviceEntity,
                ],
                synchronize: true,
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}

