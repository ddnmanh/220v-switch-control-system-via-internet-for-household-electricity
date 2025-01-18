
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceController } from './Device.controller';
import { CommonModule } from '../common/common.module';
import DeviceEntity from 'src/entity/Device.entity';
import DeviceAPEntity from 'src/entity/DeviceAP.entity';
import { DeviceRepository } from './repository/Device.repository';
import { DeviceService } from './Device.service';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            DeviceEntity, DeviceAPEntity,
        ]),
    ],
    providers: [
        DeviceService,
        DeviceRepository
    ],
    controllers: [DeviceController],
    exports: [
        DeviceService,
        DeviceRepository,
        TypeOrmModule
    ],
})
export class DeviceModule {}
