import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Catch the token from the cookie
@Injectable()
export class VerifyAccessTokenInCookieGuard implements CanActivate {

    private jwtService: JwtService;
    private readonly globalConstants: ConfigService;

    constructor(jS: JwtService, gC: ConfigService) {
        this.jwtService = jS;
        this.globalConstants = gC;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromCookie(request);

        console.log('token', token);


        if (!token) {
            throw new UnauthorizedException('Access token not found');
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.globalConstants.get('secret_key_access_token'),
                }
            );

            console.log('payload', payload);


            request[this.globalConstants.get('var_name_user_after_decode_token')] = payload;
        } catch {
            throw new UnauthorizedException('Token is invalid');
        }
        return true;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        console.log(' extractTokenFromCookie');

        return request.cookies[this.globalConstants.get('name_cookie_access_token')];
    }
}
