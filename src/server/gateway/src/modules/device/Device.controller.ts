
import { Body, Controller, Delete, Get, Inject, OnModuleInit, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DeviceServiceClient, DEVICE_SERVICE_NAME, GetDeviceInfoReq, CreateDeviceReq, DeleteDeviceReq, UpdateDeviceReq } from '../../proto/device.pb';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';
import { Roles } from '../common/decorator/role.decorator';
import { UserRole } from 'src/entity/User.entity';
import { RoleGuard } from '../common/guard/role.guard';

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
    @Roles(UserRole.ADMIN)
    @UseGuards(VerifyTokenInBearerGuard, RoleGuard)
    private async createDevice(@Body() body: CreateDeviceReq): Promise<any> {
        try {
            const data: any = await firstValueFrom(this.svc.createDevice(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Post('/')
    private async getDeviceInfo(@Body() body: GetDeviceInfoReq): Promise<any> {
        try {
            const data: any = await firstValueFrom(this.svc.getDeviceInfo({...body}));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Put('/')
    @Roles(UserRole.ADMIN)
    @UseGuards(VerifyTokenInBearerGuard, RoleGuard)
    private async updateDevice(@Body() body: UpdateDeviceReq): Promise<any> {
        try {
            const data: any = await firstValueFrom(this.svc.updateDevice(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }


    @Delete('/')
    @Roles(UserRole.ADMIN)
    @UseGuards(VerifyTokenInBearerGuard, RoleGuard)
    private async deleteDevice(@Body() body: DeleteDeviceReq): Promise<any> {
        try {
            const data: any = await firstValueFrom(this.svc.deleteDevice(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }


}
