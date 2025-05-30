
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import HistoryOperationEntity from 'src/entity/HistoryOperation.entity';
import { HistoryOperationRepository } from './HistoryOperation.repository';
import { ListendController } from './Listend.controller';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            HistoryOperationEntity
        ]),
    ],
    providers: [
        HistoryOperationRepository
    ],
    controllers: [
        ListendController
    ],
    exports: [
        HistoryOperationRepository,
        TypeOrmModule
    ],
})
export class ListendModule {}
