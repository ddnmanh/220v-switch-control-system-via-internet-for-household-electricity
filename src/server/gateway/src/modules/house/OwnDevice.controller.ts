
import { Body, Controller, Delete, Get, HttpException, Inject, OnModuleInit, Post, Put, Req, Res, UseGuards, Param, Request } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';
import { CreateOwnDeviceReq, DeleteOwnDeviceReq, HOUSE_SERVICE_NAME, HouseServiceClient, UpdateOwnDeviceReq } from 'src/proto/house.pb';

@Controller('api/own-device')
export class OwnDeviceController implements OnModuleInit {
    private svc: HouseServiceClient;
    private readonly configService: ConfigService;

    @Inject(HOUSE_SERVICE_NAME)
    private readonly client: ClientGrpc;

    constructor(cS: ConfigService) {
        this.configService = cS;
    }

    public onModuleInit(): void {
        this.svc = this.client.getService<HouseServiceClient>(HOUSE_SERVICE_NAME);
    }

    @Post('/')
    @UseGuards(VerifyTokenInBearerGuard)
    private async createOwnDevice(@Body() body: CreateOwnDeviceReq, @Req() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.createOwnDevice(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Put('/')
    @UseGuards(VerifyTokenInBearerGuard)
    private async updateOwnDevice(@Body() body: UpdateOwnDeviceReq, @Req() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.updateOwnDevice(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Delete('/')
    @UseGuards(VerifyTokenInBearerGuard)
    private async deleteOwnDevice(@Body() body: DeleteOwnDeviceReq, @Req() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.deleteOwnDevice(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Get('/:id_own_device')
    @UseGuards(VerifyTokenInBearerGuard)
    public async getArea(@Request() req:any, @Param('id_own_device') idOwnDevice: string): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];

        try {
            const data: any = await firstValueFrom(this.svc.getOwnDeviceInfo({ idUser: userOnToken.id, idOwnDevice: idOwnDevice }));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }
}
