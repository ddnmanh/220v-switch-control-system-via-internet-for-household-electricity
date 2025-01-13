import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AuthModule } from './modules/auth/Auth.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}