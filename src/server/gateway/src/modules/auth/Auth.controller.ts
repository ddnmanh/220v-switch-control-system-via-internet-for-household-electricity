
import { Body, Controller, Inject, OnModuleInit, Post, Res, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthServiceClient, RegisterReq, AUTH_SERVICE_NAME, SignInReq, ResendOTPVerifyRegisterAccountReq, OTPVerifyRegisterAccountReq } from './auth.pb';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyAccessTokenInCookieGuard } from '../common/guard/verify-access-token-in-cookie.guard';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';

@Controller('api/auth')
export class AuthController implements OnModuleInit {
    private svc: AuthServiceClient;
    private readonly configService: ConfigService;

    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc;

    constructor(cS: ConfigService) {
        this.configService = cS;
    }

    public onModuleInit(): void {
        this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    @Post('register')
    private async register(@Body() body: RegisterReq): Promise<any> {
        console.log('register in gateway');
        try {
            const data: any = await firstValueFrom(this.svc.register({...body}));

            console.log('data in gateway', data);

            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Post('register/resend-otp')
    private async resendOTPVerifyRegisterAccount(@Body() body: ResendOTPVerifyRegisterAccountReq): Promise<any> {
        try {
            let data: any = await firstValueFrom(this.svc.resendOtpVerifyRegisterAccount(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Post('register/verify-otp')
    private async verifyOTPRegisterAccount(@Body() body: OTPVerifyRegisterAccountReq): Promise<any> {
        try {
            let data: any = await firstValueFrom(this.svc.otpVerifyRegisterAccount(body));
            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Post('sign-in')
    private async login(@Body() body: SignInReq, @Res({ passthrough: true }) response: Response): Promise<any> {
        try {
            let data: any = await firstValueFrom(this.svc.signIn({ username: body.username, password: body.password }));

            if (data.data !== null) {
                // Attach access token and refresh token to cookie
                response.cookie(this.configService.get('name_cookie_refresh_token'), data?.data?.refreshToken.token, {
                    httpOnly: true,
                    secure: this.configService.get('app_run_https'),  // Set to true if you are using HTTPS
                    sameSite: 'strict',
                    maxAge: (data?.data?.refreshToken.expiresIn ? data?.data?.refreshToken.expiresIn : 0) * 1000, // Convert to milliseconds
                });

                response.cookie(this.configService.get('name_cookie_access_token'), data?.data?.accessToken.token, {
                    httpOnly: true,
                    secure: this.configService.get('app_run_https'),  // Set to true if you are using HTTPS
                    sameSite: 'strict',
                    maxAge: (data?.data?.accessToken.expiresIn ? data?.data?.accessToken.expiresIn : 0) * 1000, // Convert to milliseconds
                });
            }

            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Post('validate-token')
    @UseGuards(VerifyTokenInBearerGuard)
    // @UseGuards(VerifyAccessTokenInCookieGuard)
    private async validateToken(@Body() body: any): Promise<any> {

        console.log('validateToken in gateway');

        try {
            let data: any = await firstValueFrom(this.svc.validateToken(body));

            console.log('validateToken in gateway', data);

            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }
}
