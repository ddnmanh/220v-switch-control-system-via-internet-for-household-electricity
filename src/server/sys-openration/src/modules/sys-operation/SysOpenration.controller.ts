import { Body, Controller } from "@nestjs/common";
import { SysOperationService } from "./service/SysOpenration.service";
import { GrpcMethod } from "@nestjs/microservices";
import { CommonRes, DeleteHistoryDeviceReq, GetHistoryDeviceReq, SYS_OPENRATION_PACKAGE_NAME, SYS_OPENRATION_SERVICE_NAME } from "src/proto/SysOpenration.pb";
import StandardizeRes from "src/config/response/response.config";
import { ServiceRes } from "src/DTO/serviceRes.dto";
// import { SysOperationService } from "./service/SysOperation.service";

@Controller()
export class SysOpenrationController {

    private readonly sysOperationService: SysOperationService;

    constructor(aS: SysOperationService) {
        this.sysOperationService = aS;
    }

    @GrpcMethod(SYS_OPENRATION_SERVICE_NAME, 'getHistoryDeviceInfo')
    public async getHistoryDeviceInfo(@Body() payload: GetHistoryDeviceReq): Promise<CommonRes> {

        console.log(`SysOperationController:param : ${payload.idHouse} - ${payload.idDevice}`);

        let data:ServiceRes = await this.sysOperationService.getDeviceInfo(payload);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    @GrpcMethod(SYS_OPENRATION_SERVICE_NAME, 'deleteHistoryDeviceInfo')
    public async deleteHistoryDeviceInfo(@Body() payload: DeleteHistoryDeviceReq): Promise<CommonRes> {

        console.log(`SysOperationController:param : ${payload.idHouse} - ${payload.idDevice}`);


        let data:ServiceRes = await this.sysOperationService.deleteHistoryDevice(payload);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

}
