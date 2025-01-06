import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/Auth.module';
import { CommonModule } from './modules/common/common.module';
import { DeviceModule } from './modules/device/Device.module';

@Module({
    imports: [CommonModule, AuthModule, DeviceModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
