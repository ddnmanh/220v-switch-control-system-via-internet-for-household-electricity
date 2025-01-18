
import { Body, Controller, Delete, Get, HttpException, Inject, OnModuleInit, Post, Put, Req, Res, UseGuards, Param, Request } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';
import { CreateRoomReq, DeleteRoomReq, HOUSE_SERVICE_NAME, HouseServiceClient, UpdateRoomReq } from 'src/proto/house.pb';

@Controller('api/room')
export class RoomController implements OnModuleInit {
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
    private async createRoom(@Body() body: CreateRoomReq, @Req() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.createRoom(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Get('/:room_id')
    @UseGuards(VerifyTokenInBearerGuard)
    private async getRoom(@Request() req:any, @Param('room_id') roomId: string): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];

        try {
            const data: any = await firstValueFrom(this.svc.getRoomInfo({ idUser: userOnToken.id, roomId: roomId }));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Put('/')
    @UseGuards(VerifyTokenInBearerGuard)
    private async updateRoom(@Body() body: UpdateRoomReq, @Request() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.updateRoom(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Delete('/')
    @UseGuards(VerifyTokenInBearerGuard)
    private async deleteRoom(@Body() body:DeleteRoomReq, @Request() req:any): Promise<any> {

        let userOnToken = req[this.configService.get('var_name_user_after_decode_token')];
        body.idUser = userOnToken.id;

        try {
            const data: any = await firstValueFrom(this.svc.deleteRoom(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

}
