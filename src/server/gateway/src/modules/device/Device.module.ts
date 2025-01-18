import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeviceController } from './Device.controller';
import { DEVICE_PACKAGE_NAME, DEVICE_SERVICE_NAME } from '../../proto/device.pb';
import { DeviceService } from './service/Device.service';
import { join } from 'path';
import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { CommonModule } from '../common/common.module';

@Global()
@Module({
    imports: [
        CommonModule,
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
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.key')),  // Private key client
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.crt')),  // Chứng chỉ client
                    ),
                },
            },
        ]),
    ],
    controllers: [DeviceController],
    providers: [DeviceService],
    exports: [DeviceService],
})
export class DeviceModule { }
