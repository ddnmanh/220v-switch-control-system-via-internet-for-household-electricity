import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HOUSE_PACKAGE_NAME, HOUSE_SERVICE_NAME } from '../../proto/house.pb';
import { join } from 'path';
import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { CommonModule } from '../common/common.module';
import { HouseService } from './House.service';
import { HouseController } from './House.controller';
import { RoomController } from './Room.controller';
import { OwnDeviceController } from './OwnDevice.controller';

@Global()
@Module({
    imports: [
        CommonModule,
        ClientsModule.register([
            {
                name: HOUSE_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: 'localhost:50053',
                    package: HOUSE_PACKAGE_NAME,
                    protoPath: join(__dirname, '../../../node_modules/config-project-global/proto/house.proto'),
                    credentials: grpc.credentials.createSsl(
                        fs.readFileSync(join(__dirname, '../../../node_modules/config-project-global/mTLS/RootCA.pem')),  // CA Root
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.key')),  // Private key client
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.crt')),  // Chứng chỉ client
                    ),
                },
            },
        ]),
    ],
    controllers: [HouseController, RoomController, OwnDeviceController],
    providers: [HouseService,],
    exports: [HouseService],
})
export class HouseModule { }
