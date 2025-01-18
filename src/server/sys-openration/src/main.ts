import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { GrpcExceptionFilter } from './config/filters/GrpcExceptionFilter.filter';
import * as fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import { NamingStandardsConversionInterceptor } from './config/interceptor/NamingStandardsConversion.interceptor';
import { TrimDataInterceptor } from './config/interceptor/TrimData.interceptor';
import { protobufPackage } from './proto/SysOpenration.pb';

async function bootstrap() {
    const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.GRPC,
        options: {
            url: 'localhost:50054',
            package: protobufPackage,
            protoPath: join(__dirname, '../node_modules/config-project-global/proto/SysOpenration.proto'),
            credentials: grpc.ServerCredentials.createSsl(
                fs.readFileSync(join(__dirname, '../node_modules/config-project-global/mTLS/RootCA.pem')),   // CA (Optional, if have RootCA)
                [{
                    cert_chain: fs.readFileSync(join(__dirname, '../mTLS/SysOpenration.crt')), // Chứng chỉ server
                    private_key: fs.readFileSync(join(__dirname, '../mTLS/SysOpenration.key'))  // Private key server
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
