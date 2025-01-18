
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import HistoryOperationEntity from 'src/entity/HistoryOperation.entity';
import { ListendMQTTService } from './service/ListendMQTT.service';
import { HistoryOperationRepository } from './HistoryOperation.repository';
import { SysOpenrationController } from './SysOpenration.controller';
import { SysOperationService } from './service/SysOpenration.service';

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([
            HistoryOperationEntity
        ]),
    ],
    providers: [
        ListendMQTTService,
        SysOperationService,
        HistoryOperationRepository
    ],
    controllers: [
        SysOpenrationController
    ],
    exports: [
        ListendMQTTService,
        HistoryOperationRepository,
        TypeOrmModule
    ],
})
export class SysOpenrationModule {}
