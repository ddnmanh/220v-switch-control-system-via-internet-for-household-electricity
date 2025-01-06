import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import HouseEntity from 'src/entity/House.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';

@Injectable()
export class HouseRepository {

    constructor(
        @InjectRepository(HouseEntity)
        private readonly deviceRepository: Repository<HouseEntity>,
        private readonly generateUUIDService: GenerateUUIDService, // Inject GenerateUUIDService
    ) {}

}
