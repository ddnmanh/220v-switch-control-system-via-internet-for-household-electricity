import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/Auth.module';
import { CommonModule } from './modules/common/common.module';
import { DeviceModule } from './modules/device/Device.module';
import { HouseModule } from './modules/house/House.module';
import { SysOperationModule } from './modules/sys-operation/SysOperation.module';


@Module({
    imports: [CommonModule, AuthModule, DeviceModule, HouseModule, SysOperationModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
