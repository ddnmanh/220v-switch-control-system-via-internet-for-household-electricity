
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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEVICE_PACKAGE_NAME, DEVICE_SERVICE_NAME } from 'src/proto/device.pb';
import { join } from 'path';
import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { SYS_OPENRATION_PACKAGE_NAME, SYS_OPENRATION_SERVICE_NAME } from 'src/proto/SysOpenration.pb';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            HouseEntity, SettingEntity, RoomEntity, OwnDeviceEntity
        ]),
        ClientsModule.register([
            {
                name: DEVICE_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: 'localhost:50052',
                    package: DEVICE_PACKAGE_NAME,
                    protoPath: join(__dirname, '../../../node_modules/config-project-global/proto/device.proto'),
                    credentials: grpc.credentials.createSsl(
                        fs.readFileSync(join(__dirname, '../../../node_modules/config-project-global/mTLS/RootCA.pem')),  // CA Root
                        fs.readFileSync(join(__dirname, '../../../mTLS/houseService.key')),  // Private key client
                        fs.readFileSync(join(__dirname, '../../../mTLS/houseService.crt')),  // Chứng chỉ client
                    ),
                },
            },
            {
                name: SYS_OPENRATION_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: 'localhost:50054',
                    package: SYS_OPENRATION_PACKAGE_NAME,
                    protoPath: join(__dirname, '../../../node_modules/config-project-global/proto/SysOpenration.proto'),
                    credentials: grpc.credentials.createSsl(
                        fs.readFileSync(join(__dirname, '../../../node_modules/config-project-global/mTLS/RootCA.pem')),  // CA Root
                        fs.readFileSync(join(__dirname, '../../../mTLS/houseService.key')),  // Private key client
                        fs.readFileSync(join(__dirname, '../../../mTLS/houseService.crt')),  // Chứng chỉ client
                    ),
                },
            },
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
