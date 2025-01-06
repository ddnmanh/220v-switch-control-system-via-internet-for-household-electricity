
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './House.controller';
import { CommonModule } from '../common/common.module';
import { HouseRepository } from './repository/House.repository';
import { HouseService } from './House.service';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';
import AreaEntity from 'src/entity/Area.entity';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            HouseEntity, SettingEntity, AreaEntity, OwnDeviceEntity
        ]),
    ],
    providers: [
        HouseService,
        HouseRepository
    ],
    controllers: [DeviceController],
    exports: [
        HouseService,
        HouseRepository,
        TypeOrmModule
    ],
})
export class HouseModule {}
