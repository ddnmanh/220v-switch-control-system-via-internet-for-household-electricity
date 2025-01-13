import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModule } from './modules/device/Device.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    CommonModule,
    DeviceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
