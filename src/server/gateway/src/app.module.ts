import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/Auth.module';
import { CommonModule } from './modules/common/common.module';
import { DeviceModule } from './modules/device/Device.module';
import { HouseModule } from './modules/house/House.module';

@Module({
    imports: [CommonModule, AuthModule, DeviceModule, HouseModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
