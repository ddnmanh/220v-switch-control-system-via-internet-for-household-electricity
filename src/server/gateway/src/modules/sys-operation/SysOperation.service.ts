import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SYS_OPENRATION_SERVICE_NAME, SysOpenrationServiceClient } from 'src/proto/SysOpenration.pb';

@Injectable()
export class SysOperationService {
    private svc: SysOpenrationServiceClient;

    @Inject(SYS_OPENRATION_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<SysOpenrationServiceClient>(SYS_OPENRATION_SERVICE_NAME);
    }

}
