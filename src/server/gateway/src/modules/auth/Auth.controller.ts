
import { Body, Controller, Get, Inject, OnModuleInit, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthServiceClient, RegisterReq, AUTH_SERVICE_NAME, LogInReq, ResendOTPVerifyRegisterAccountReq, OTPVerifyRegisterAccountReq, LogOutReq } from './auth.pb';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import StandardizeRes from '../../config/response/response.config';
import { CatchingCommunicategRPC } from 'src/config/catching/catchingCommunicategRPC.catching';
import { VerifyAccessTokenInCookieGuard } from '../common/guard/verify-access-token-in-cookie.guard';
import { VerifyTokenInBearerGuard } from '../common/guard/verify-token-in-bearer.guard';
import { VerifyRefreshTokenInCookieGuard } from '../common/guard/verify-refresh-token-in-cookie.guard';

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

    @Post('log-in')
    private async login(@Body() body: LogInReq, @Res({ passthrough: true }) response: Response): Promise<any> {

        console.log('login in gateway');
        console.log('body in gateway', body);


        try {
            let data: any = await firstValueFrom(this.svc.logIn(body));

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

    @Post('log-out')
    private async logout(@Body() body: LogOutReq, @Res({ passthrough: true }) response: Response): Promise<any> {

        try {
            response.clearCookie(this.configService.get('name_cookie_refresh_token'));
            response.clearCookie(this.configService.get('name_cookie_access_token'));

            let data: any = await firstValueFrom(this.svc.logOut(body));

            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    // @Post('validate-token')
    // @UseGuards(VerifyTokenInBearerGuard)
    // private async validateToken(@Body() body: any, @Req() request: Request): Promise<any> {

    //     console.log('validateToken in gateway');

    //     body = request[this.configService.get('var_name_user_after_decode_token')];
    //     console.log('body in gateway', body);

    //     try {
    //         let data: any = await firstValueFrom(this.svc.validateToken(body));

    //         console.log('validateToken in gateway', data);

    //         return new StandardizeRes(data).resp();
    //     } catch (error: any) {
    //         return CatchingCommunicategRPC.catchRPCError(error);
    //     }
    // }

    @Post('user-info')
    @UseGuards(VerifyTokenInBearerGuard)
    private async getUserInfo(@Body() body: any): Promise<any> {
        try {
            let data: any = await firstValueFrom(this.svc.getUserInfo(body));

            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }

    @Post('renew-access-token')
    // @UseGuards(VerifyTokenInBearerGuard)
    private async renewAccessToken(@Body() body: any): Promise<any> {

        console.log('renewAccessToken in gateway');
        console.log('body in gateway', body);



        try {
            let data: any = await firstValueFrom(this.svc.renewAccessToken(body));

            return new StandardizeRes(data).resp();
        } catch (error: any) {
            return CatchingCommunicategRPC.catchRPCError(error);
        }
    }
}
