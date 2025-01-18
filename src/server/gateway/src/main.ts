import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './config/filters/AllExceptionsFilter.filter';
import { ResponseStructureInterceptor } from './config/interceptor/ResponseStructure.interceptor';
import { CustomValidationPipe } from './config/validation/CustomValidationPipe.pipe';
import { NamingStandardsConversionInterceptor } from './config/interceptor/NamingStandardsConversion.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    const valueConfig = app.get(ConfigService);

    app.enableCors({
        origin: true, // Mở cho tất cả origin hoặc chỉ origin cụ thể
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true, // Nếu sử dụng cookie để lưu trữ token
    });

    app.use(cookieParser());

    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(
        new ResponseStructureInterceptor(),
        new NamingStandardsConversionInterceptor()
    );
    app.useGlobalPipes(new CustomValidationPipe());

    await app.listen(valueConfig.get('app_run_port'));
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
