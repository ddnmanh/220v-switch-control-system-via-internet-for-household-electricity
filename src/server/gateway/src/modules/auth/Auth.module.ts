import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './Auth.controller';
import { AUTH_SERVICE_NAME, AUTH_PACKAGE_NAME } from './auth.pb';
import { AuthService } from './service/Auth.service';
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
                name: AUTH_SERVICE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: 'localhost:50051',
                    package: AUTH_PACKAGE_NAME,
                    protoPath: join(__dirname, '../../../node_modules/config-project-global/proto/auth.proto'),
                    credentials: grpc.credentials.createSsl(
                        fs.readFileSync(join(__dirname, '../../../node_modules/config-project-global/mTLS/RootCA.pem')),  // CA Root
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.key')),  // Private key client
                        fs.readFileSync(join(__dirname, '../../../mTLS/gateway.crt')),  // Chứng chỉ client
                    ),
                },
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
