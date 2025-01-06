
import { Body, Controller, Get, Inject, OnModuleInit, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DeviceServiceClient, DEVICE_SERVICE_NAME, GetDeviceInfoReq } from '../../proto/device.pb';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';

@Controller('api/device')
export class DeviceController implements OnModuleInit {
    private svc: DeviceServiceClient;
    private readonly configService: ConfigService;

    @Inject(DEVICE_SERVICE_NAME)
    private readonly client: ClientGrpc;

    constructor(cS: ConfigService) {
        this.configService = cS;
    }

    public onModuleInit(): void {
        this.svc = this.client.getService<DeviceServiceClient>(DEVICE_SERVICE_NAME);
    }

    @Post('/')
    private async register(@Body() body: GetDeviceInfoReq): Promise<any> {
        try {
            const data: any = await firstValueFrom(this.svc.getDeviceInfo({...body}));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }
}
