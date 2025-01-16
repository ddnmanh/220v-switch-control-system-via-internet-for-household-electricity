import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';
import HistoryOperationEntity from 'src/entity/HistoryOperation.entity';

@Injectable()
export class HistoryOperationRepository {

    constructor(
        @InjectRepository(HistoryOperationEntity)
        private readonly historyOperationRepository: Repository<HistoryOperationEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

    async createHistoryOperation(idHouse: string, idDevice: string, state: boolean): Promise<HistoryOperationEntity> {
        let newHistoryOperation = new HistoryOperationEntity();
        newHistoryOperation.idHouse = idHouse;
        newHistoryOperation.idDevice = idDevice;
        newHistoryOperation.state = state;
        newHistoryOperation.eventDateTime = new Date();

        return await this.historyOperationRepository.save(newHistoryOperation);
    }

    async getHistoryDevice(idHouse: string, idDevice: string): Promise<HistoryOperationEntity[]> {
        return await this.historyOperationRepository.createQueryBuilder('historyOperation')
            .where('historyOperation.idHouse = :idHouse', { idHouse: idHouse })
            .andWhere('historyOperation.idDevice = :idDevice', { idDevice: idDevice })
            .orderBy('historyOperation.eventDateTime', 'DESC')
            .getMany();
    }

}
