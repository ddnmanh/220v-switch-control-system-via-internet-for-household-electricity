import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { HOUSE_SERVICE_NAME, HouseServiceClient } from 'src/proto/house.pb';

@Injectable()
export class HouseService {
    private svc: HouseServiceClient;

    @Inject(HOUSE_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<HouseServiceClient>(HOUSE_SERVICE_NAME);
    }

}
