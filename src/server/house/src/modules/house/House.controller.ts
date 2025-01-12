import { Body, Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HouseService } from "./services/House.service";
import { GrpcMethod } from "@nestjs/microservices";
import { CommonRes, CreateRoomReq, CreateHouseReq, CreateOwnDeviceReq, DeleteOwnDeviceReq, GetRoomReq, GetHouseReq, GetOwnDeviceReq, HOUSE_SERVICE_NAME, UpdateRoomReq, UpdateHouseReq, UpdateOwnDeviceReq } from "src/proto/house.pb";
import { ServiceRes } from "src/DTO/serviceRes.dto";
import StandardizeRes from "src/config/response/response.config";
import { RoomService } from "./services/Room.service";
import { OwnDeviceService } from "./services/OwnDevice.service";

@Controller()
export class DeviceController {

    private readonly houseService: HouseService;
    private readonly roomService: RoomService;
    private readonly ownDeviceService: OwnDeviceService;
    private readonly configService: ConfigService;

    constructor(aS: HouseService, aRS: RoomService, oDS: OwnDeviceService, cS: ConfigService) {
        this.houseService = aS;
        this.roomService = aRS;
        this.ownDeviceService = oDS;
        this.configService = cS;
    }

    // HOUSE
    @GrpcMethod(HOUSE_SERVICE_NAME, 'createHouse')
    public async createHouse(@Body() body: CreateHouseReq): Promise<CommonRes> {
        let data:ServiceRes = await this.houseService.createHouse(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'getHouseInfo')
    public async getHouse(@Body() body: GetHouseReq): Promise<CommonRes> {
        let data:ServiceRes = await this.houseService.getHouse(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'updateHouse')
    public async updateHouse(@Body() body: UpdateHouseReq): Promise<CommonRes> {
        let data:ServiceRes = await this.houseService.updateHouse(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'deleteHouse')
    public async deleteHouse(@Body() body: UpdateHouseReq): Promise<CommonRes> {
        let data:ServiceRes = await this.houseService.deleteHouse(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    // AREA
    @GrpcMethod(HOUSE_SERVICE_NAME, 'createRoom')
    public async createRoom(@Body() body: CreateRoomReq): Promise<CommonRes> {
        let data:ServiceRes = await this.roomService.createRoom(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'getRoomInfo')
    public async getRoom(@Body() body: GetRoomReq): Promise<CommonRes> {
        let data:ServiceRes = await this.roomService.getRoom(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'updateRoom')
    public async updateRoom(@Body() body: UpdateRoomReq): Promise<CommonRes> {
        let data:ServiceRes = await this.roomService.updateRoom(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'deleteRoom')
    public async deleteRoom(@Body() body: UpdateRoomReq): Promise<CommonRes> {
        let data:ServiceRes = await this.roomService.deleteRoom(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    // OWN DEVICE
    @GrpcMethod(HOUSE_SERVICE_NAME, 'createOwnDevice')
    public async createOwnDevice(@Body() body: CreateOwnDeviceReq): Promise<CommonRes> {
        let data:ServiceRes = await this.ownDeviceService.createOwnDevice(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'getOwnDeviceInfo')
    public async getOwnDeviceInfo(@Body() body: GetOwnDeviceReq): Promise<CommonRes> {
        let data:ServiceRes = await this.ownDeviceService.getOwnDevice(body);
        console.log(data);

        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'updateOwnDevice')
    public async updateOwnDevice(@Body() body: UpdateOwnDeviceReq): Promise<CommonRes> {
        let data:ServiceRes = await this.ownDeviceService.updateOwnDevice(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'deleteOwnDevice')
    public async deleteOwnDevice(@Body() body: DeleteOwnDeviceReq): Promise<CommonRes> {
        let data:ServiceRes = await this.ownDeviceService.deleteOwnDevice(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

}
