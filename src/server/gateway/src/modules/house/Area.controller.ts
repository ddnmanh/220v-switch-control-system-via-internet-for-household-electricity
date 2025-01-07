
import { Body, Controller, Delete, Get, HttpException, Inject, OnModuleInit, Post, Put, Req, Res, UseGuards, Param, Request } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';
import { CreateAreaReq, DeleteAreaReq, HOUSE_SERVICE_NAME, HouseServiceClient, UpdateAreaReq } from 'src/proto/house.pb';

@Controller('api/area')
export class AreaController implements OnModuleInit {
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
    private async createArea(@Body() body: CreateAreaReq, @Req() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.createArea(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Get('/:area_id')
    @UseGuards(VerifyTokenInBearerGuard)
    public async getArea(@Request() req:any, @Param('area_id') areaId: string): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];

        try {
            const data: any = await firstValueFrom(this.svc.getAreaInfo({ idUser: userOnToken.id, areaId: areaId }));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Put('/')
    @UseGuards(VerifyTokenInBearerGuard)
    public async updateArea(@Body() body: UpdateAreaReq, @Request() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.updateArea(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Delete('/')
    @UseGuards(VerifyTokenInBearerGuard)
    public async deleteArea(@Body() body:DeleteAreaReq, @Request() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.deleteArea(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

}
