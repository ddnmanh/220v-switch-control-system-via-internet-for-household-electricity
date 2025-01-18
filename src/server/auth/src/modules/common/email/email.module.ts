import { Module } from '@nestjs/common';
import { EmailService } from './Email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule
    ],
    controllers: [],
    providers: [
        EmailService,
    ],
    exports: [
        EmailService,
    ],
})

export class EmailModule {}
