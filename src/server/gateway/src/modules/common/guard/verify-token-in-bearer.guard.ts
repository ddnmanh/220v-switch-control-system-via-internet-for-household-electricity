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
export class VerifyTokenInBearerGuard implements CanActivate {

    private jwtService: JwtService;
    private readonly globalConstants: ConfigService;

    constructor(jS: JwtService, gC: ConfigService) {
        this.jwtService = jS;
        this.globalConstants = gC;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);


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


            request[this.globalConstants.get('var_name_user_after_decode_token')] = payload;
        } catch {
            throw new UnauthorizedException('Token is invalid');
        }
        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {

        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return undefined;
        }

        return authHeader.split(' ')[1]; // Extract the token after 'Bearer '
    }
}
