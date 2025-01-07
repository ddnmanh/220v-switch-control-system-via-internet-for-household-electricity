
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './House.controller';
import { CommonModule } from '../common/common.module';
import { HouseRepository } from './repositorys/House.repository';
import { HouseService } from './services/House.service';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';
import AreaEntity from 'src/entity/Area.entity';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';
import { AreaService } from './services/Area.service';
import { AreaRepository } from './repositorys/Area.repository';
import { OwnDeviceService } from './services/OwnDevice.service';
import { OwnDeviceRepository } from './repositorys/OwnDevice.repository';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            HouseEntity, SettingEntity, AreaEntity, OwnDeviceEntity
        ]),
    ],
    providers: [
        HouseService,
        AreaService,
        OwnDeviceService,
        HouseRepository,
        AreaRepository,
        OwnDeviceRepository
    ],
    controllers: [DeviceController],
    exports: [
        HouseService,
        AreaService,
        HouseRepository,
        AreaRepository,
        OwnDeviceRepository,
        TypeOrmModule
    ],
})
export class HouseModule {}
