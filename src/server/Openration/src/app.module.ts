import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { ListendModule } from './modules/listend/Listend.module';

@Module({
    imports: [
        CommonModule,
        ListendModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
