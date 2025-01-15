import { Module } from '@nestjs/common';
import { SysOpenrationModule } from './modules/sys-operation/SysOpenration.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    CommonModule,
    SysOpenrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
