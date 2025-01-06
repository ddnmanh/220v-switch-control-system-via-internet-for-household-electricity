import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HouseRepository } from './repository/House.repository';

@Injectable()
export class HouseService {

    private readonly globalConstants: ConfigService;
    private readonly houseRepository: HouseRepository;

    constructor(
        dR: HouseRepository, gC: ConfigService
    ) {
        this.houseRepository = dR;
        this.globalConstants = gC;
    }


}
