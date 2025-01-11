import { Body, Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HouseService } from "./services/House.service";
import { GrpcMethod } from "@nestjs/microservices";
import { CommonRes, CreateAreaReq, CreateHouseReq, CreateOwnDeviceReq, DeleteOwnDeviceReq, GetAreaReq, GetHouseReq, GetOwnDeviceReq, HOUSE_SERVICE_NAME, UpdateAreaReq, UpdateHouseReq, UpdateOwnDeviceReq } from "src/proto/house.pb";
import { ServiceRes } from "src/DTO/serviceRes.dto";
import StandardizeRes from "src/config/response/response.config";
import { AreaService } from "./services/Area.service";
import { OwnDeviceService } from "./services/OwnDevice.service";

@Controller()
export class DeviceController {

    private readonly houseService: HouseService;
    private readonly areaService: AreaService;
    private readonly ownDeviceService: OwnDeviceService;
    private readonly configService: ConfigService;

    constructor(aS: HouseService, aRS: AreaService, oDS: OwnDeviceService, cS: ConfigService) {
        this.houseService = aS;
        this.areaService = aRS;
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
    @GrpcMethod(HOUSE_SERVICE_NAME, 'createArea')
    public async createArea(@Body() body: CreateAreaReq): Promise<CommonRes> {
        let data:ServiceRes = await this.areaService.createArea(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'getAreaInfo')
    public async getArea(@Body() body: GetAreaReq): Promise<CommonRes> {
        let data:ServiceRes = await this.areaService.getArea(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'updateArea')
    public async updateArea(@Body() body: UpdateAreaReq): Promise<CommonRes> {
        let data:ServiceRes = await this.areaService.updateArea(body);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(HOUSE_SERVICE_NAME, 'deleteArea')
    public async deleteArea(@Body() body: UpdateAreaReq): Promise<CommonRes> {
        let data:ServiceRes = await this.areaService.deleteArea(body);
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
