
import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post, Put, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';
import { SYS_OPENRATION_SERVICE_NAME, SysOpenrationServiceClient } from 'src/proto/SysOpenration.pb';

@Controller('api/sys-operation')
export class SysOperationController implements OnModuleInit {

    private svc: SysOpenrationServiceClient;
    private readonly configService: ConfigService;

    @Inject(SYS_OPENRATION_SERVICE_NAME)
    private readonly client: ClientGrpc;

    constructor(cS: ConfigService) {
        this.configService = cS;
    }

    public onModuleInit(): void {
        this.svc = this.client.getService<SysOpenrationServiceClient>(SYS_OPENRATION_SERVICE_NAME);
    }

    @Get('device/:house_id?/:device_id?')
    @UseGuards(VerifyTokenInBearerGuard)
    public async getHouse(@Request() req:any, @Query('house_id') houseId: string, @Query('device_id') deviceId: string): Promise<any> {

        console.log(`SysOperationController:param : ${houseId} - ${deviceId}`);

        try {
            const data: any = await firstValueFrom(this.svc.getHistoryDeviceInfo({ idHouse: houseId, idDevice: deviceId, mqttTopic: '' }));

            console.log(data);

            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

}
