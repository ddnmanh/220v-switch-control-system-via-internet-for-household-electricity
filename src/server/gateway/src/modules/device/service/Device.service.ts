import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DeviceServiceClient, CommonRes, DEVICE_SERVICE_NAME } from '../../../proto/device.pb';

@Injectable()
export class DeviceService {
    private svc: DeviceServiceClient;

    @Inject(DEVICE_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<DeviceServiceClient>(DEVICE_SERVICE_NAME);
    }

}
