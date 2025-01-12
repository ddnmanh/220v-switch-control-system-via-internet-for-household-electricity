
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './House.controller';
import { CommonModule } from '../common/common.module';
import { HouseRepository } from './repositorys/House.repository';
import { HouseService } from './services/House.service';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';
import RoomEntity from 'src/entity/Room.entity';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';
import { RoomService } from './services/Room.service';
import { RoomRepository } from './repositorys/Room.repository';
import { OwnDeviceService } from './services/OwnDevice.service';
import { OwnDeviceRepository } from './repositorys/OwnDevice.repository';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            HouseEntity, SettingEntity, RoomEntity, OwnDeviceEntity
        ]),
    ],
    providers: [
        HouseService,
        RoomService,
        OwnDeviceService,
        HouseRepository,
        RoomRepository,
        OwnDeviceRepository
    ],
    controllers: [DeviceController],
    exports: [
        HouseService,
        RoomService,
        HouseRepository,
        RoomRepository,
        OwnDeviceRepository,
        TypeOrmModule
    ],
})
export class HouseModule {}
