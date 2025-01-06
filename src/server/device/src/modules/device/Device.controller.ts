import { Body, Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GrpcMethod } from "@nestjs/microservices";
import StandardizeRes from "src/config/response/response.config";
import { ServiceRes } from "src/DTO/serviceRes.dto";
import { DEVICE_SERVICE_NAME, GetDeviceInfoReq } from "./../../proto/device.pb";
import { DeviceService } from "./Device.service";

@Controller()
export class DeviceController {

    private readonly deviceService: DeviceService;
    private readonly configService: ConfigService;

    constructor(aS: DeviceService, cS: ConfigService) {
        this.deviceService = aS;
        this.configService = cS;
    }

    @GrpcMethod(DEVICE_SERVICE_NAME, 'getDeviceInfo')
    public async getDeviceInfo(@Body() payload: GetDeviceInfoReq): Promise<ServiceRes> {
        let data:ServiceRes = await this.deviceService.getDeviceInfo(payload);
        return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    }

    // @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
    // public async register(@Body() payload: RegisterReq): Promise<CommonRes> {

    //     console.log('register in auth controller');


    //     let data:ServiceRes = await this.deviceService.registerUser(payload);

    //     await this.deviceService.sendEmailOTP(data.data);

    //     return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    // }

    // @GrpcMethod(AUTH_SERVICE_NAME, 'resendOtpVerifyRegisterAccount')
    // public async resendOTPVerifyRegisterAccount(body: ResendOTPVerifyRegisterAccountReq): Promise<CommonRes> {
    //     let data:ServiceRes = await this.deviceService.resendOTPVerifyRegisterAccount(body);
    //     return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    // }

    // @GrpcMethod(AUTH_SERVICE_NAME, 'otpVerifyRegisterAccount')
    // public async otpVerifyRegisterAccount(body: OTPVerifyRegisterAccountReq): Promise<CommonRes> {
    //     let data:ServiceRes = await this.deviceService.otpVerifyRegisterAccount(body);
    //     return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    // }


    // @GrpcMethod(AUTH_SERVICE_NAME, 'LogIn')
    // public async logIn(@Body() payload: LogInReq): Promise<CommonRes> {
    //     let data:ServiceRes = await this.deviceService.logIn(payload);
    //     return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    // }

    // @GrpcMethod(AUTH_SERVICE_NAME, 'logOut')
    // public async logOut(body: LogOutReq): Promise<CommonRes> {
    //     let data:ServiceRes = await this.deviceService.logOut(body);
    //     return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    // }

    // @GrpcMethod(AUTH_SERVICE_NAME, 'getUserInfo')
    // public async getUserInfo(body: GetUserInfoReq): Promise<CommonRes> {
    //     let data:ServiceRes = await this.deviceService.getUserInfo(body);
    //     return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    // }

    // @GrpcMethod(AUTH_SERVICE_NAME, 'renewAccessToken')
    // public async renewAccessToken(body: RenewAccessTokenReq): Promise<CommonRes> {
    //     let data:ServiceRes = await this.deviceService.getNewAccessToken(body);
    //     return new StandardizeRes().code(data.message.length > 0 ? 400 : 200).body(data).formatResponse();
    // }
}
