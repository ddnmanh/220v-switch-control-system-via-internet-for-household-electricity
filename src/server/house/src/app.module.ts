import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './modules/common/common.module';

import { HouseModule } from './modules/house/House.module';

@Module({
  imports: [
    CommonModule,
    HouseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
