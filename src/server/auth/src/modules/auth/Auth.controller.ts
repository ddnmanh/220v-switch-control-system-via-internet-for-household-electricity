import { Body, Controller } from "@nestjs/common";
import { AuthService } from "./service/Auth.service";
import { ConfigService } from "@nestjs/config";
import { AUTH_SERVICE_NAME, SignInReq, CommonRes, RegisterReq, ValidateTokenReq } from "./auth.pb";
import { GrpcMethod } from "@nestjs/microservices";
import StandardizeRes from "src/config/response/response.config";
import { ServiceRes } from "src/DTO/ServiceRes.dto";

@Controller()
export class AutController {

    private readonly authService: AuthService;
    private readonly configService: ConfigService;

    constructor(aS: AuthService, cS: ConfigService) {
        this.authService = aS;
        this.configService = cS;
    }

    @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
    public async register(@Body() payload: RegisterReq): Promise<CommonRes> {
        let data:ServiceRes = await this.authService.registerUser(payload);
        return new StandardizeRes().code(200).body(data).formatResponse();
    }

    @GrpcMethod(AUTH_SERVICE_NAME, 'SignIn')
    public async signIn(@Body() payload: SignInReq): Promise<CommonRes> {
        let data:ServiceRes = await this.authService.signIn(payload);
        return new StandardizeRes().code(200).body(data).formatResponse();
    }

    @GrpcMethod(AUTH_SERVICE_NAME, 'ValidateToken')
    public async validateToken(body: ValidateTokenReq): Promise<CommonRes> {

        console.log('validateToken in gateway');

        // throw new RpcException("Method not implemented");

        let data = {
            status: true,
            message: [],
            data: {
                id: 1,
                username: 'username',
                email: 'email',
                role: 'ADMIN'
            }
        };

        return new StandardizeRes().code(200).body(data).formatResponse();
    }
}
