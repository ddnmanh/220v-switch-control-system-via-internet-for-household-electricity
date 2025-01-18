import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { CommonModule } from '../common/common.module';
import { SYS_OPENRATION_PACKAGE_NAME, SYS_OPENRATION_SERVICE_NAME } from 'src/proto/SysOpenration.pb';
import { SysOperationController } from './SysOperation.controller';
import { SysOperationService } from './SysOperation.service';

@Global()
@Module({
    imports: [
        CommonModule,
        ClientsModule.register([
            {
                name: SYS_OPENRATION_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: 'localhost:50054',
                    package: SYS_OPENRATION_PACKAGE_NAME,
                    protoPath: join(__dirname, '../../../node_modules/config-project-global/proto/SysOpenration.proto'),
                    credentials: grpc.credentials.createSsl(
                        fs.readFileSync(join(__dirname, '../../../node_modules/config-project-global/mTLS/RootCA.pem')),  // CA Root
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.key')),  // Private key client
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.crt')),  // Chứng chỉ client
                    ),
                },
            },
        ]),
    ],
    controllers: [SysOperationController],
    providers: [SysOperationService],
    exports: [SysOperationService],
})
export class SysOperationModule { }
