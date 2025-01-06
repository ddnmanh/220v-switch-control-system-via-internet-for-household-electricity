import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { protobufPackage } from './proto/device.pb';
import { GrpcExceptionFilter } from './config/filters/GrpcExceptionFilter.filter';
import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { NamingStandardsConversionInterceptor } from './config/interceptor/NamingStandardsConversion.interceptor';
import { TrimDataInterceptor } from './config/interceptor/TrimData.interceptor';

async function bootstrap() {
    const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.GRPC,
        options: {
            url: 'localhost:50052',
            package: protobufPackage,
            protoPath: join(__dirname, '../node_modules/config-project-global/proto/device.proto'),
            credentials: grpc.ServerCredentials.createSsl(
                fs.readFileSync(join(__dirname, '../node_modules/config-project-global/mTLS/RootCA.pem')),   // CA (Optional, if have RootCA)
                [{
                    cert_chain: fs.readFileSync(join(__dirname, '../mTLS/deviceService.crt')), // Chứng chỉ server
                    private_key: fs.readFileSync(join(__dirname, '../mTLS/deviceService.key'))  // Private key server
                }],
                true  // require verify client (mTLS)
            )
        },
    });

    app.useGlobalFilters(new GrpcExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new NamingStandardsConversionInterceptor(), new TrimDataInterceptor());

    await app.listen();
}

bootstrap();
