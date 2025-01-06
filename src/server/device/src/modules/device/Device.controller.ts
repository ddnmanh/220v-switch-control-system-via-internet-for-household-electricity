import { Body, Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GrpcMethod } from "@nestjs/microservices";
import StandardizeRes from "src/config/response/response.config";
import { ServiceRes } from "src/DTO/serviceRes.dto";
import { CreateDeviceReq, DEVICE_SERVICE_NAME, GetDeviceInfoReq, UpdateDeviceReq } from "./../../proto/device.pb";
import { DeviceService } from "./Device.service";

@Controller()
export class DeviceController {

    private readonly deviceService: DeviceService;
    private readonly configService: ConfigService;

    constructor(aS: DeviceService, cS: ConfigService) {
        this.deviceService = aS;
        this.configService = cS;
    }

    @GrpcMethod(DEVICE_SERVICE_NAME, 'createDevice')
    public async createDevice(@Body() payload: CreateDeviceReq): Promise<ServiceRes> {
        let data:ServiceRes = await this.deviceService.createDevice(payload);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(DEVICE_SERVICE_NAME, 'getDeviceInfo')
    public async getDeviceInfo(@Body() payload: GetDeviceInfoReq): Promise<ServiceRes> {
        let data:ServiceRes = await this.deviceService.getDeviceInfo(payload);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(DEVICE_SERVICE_NAME, 'updateDevice')
    public async updateDevice(@Body() payload: UpdateDeviceReq): Promise<ServiceRes> {
        let data:ServiceRes = await this.deviceService.updateDevice(payload);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(DEVICE_SERVICE_NAME, 'deleteDevice')
    public async deleteDevice(@Body() payload: GetDeviceInfoReq): Promise<ServiceRes> {
        let data:ServiceRes = await this.deviceService.deleteDevice(payload);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

}
