
import { Body, Controller, Delete, Get, HttpException, Inject, OnModuleInit, Post, Put, Req, Res, UseGuards, Param, Request } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';
import { CreateHouseReq, DeleteHouseReq, HOUSE_SERVICE_NAME, HouseServiceClient, UpdateHouseReq } from 'src/proto/house.pb';

@Controller('api/house')
export class HouseController implements OnModuleInit {
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
    private async createHouse(@Body() body: CreateHouseReq, @Req() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];

        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.createHouse(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Get('/:house_id')
    @UseGuards(VerifyTokenInBearerGuard)
    public async getHouse(@Request() req:any, @Param('house_id') houseId: string): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];

        try {
            const data: any = await firstValueFrom(this.svc.getHouseInfo({ idUser: userOnToken.id, houseId: houseId }));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Put('/')
    @UseGuards(VerifyTokenInBearerGuard)
    public async updateHouse(@Body() body: UpdateHouseReq, @Request() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.updateHouse(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Delete('/')
    @UseGuards(VerifyTokenInBearerGuard)
    public async deleteHouse(@Body() body:DeleteHouseReq, @Request() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.deleteHouse(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

}
