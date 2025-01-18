import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthService } from '../../auth/service/Auth.service';
import { CommonRes } from '../../../proto/auth.pb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {

    @Inject(AuthService)
    public readonly authService: AuthService;

    public readonly globalConstants: ConfigService;

    constructor(aS: AuthService, gC: ConfigService ) {
        this.authService = aS;
        this.globalConstants = gC;
    }

    public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {

        const req: Request = ctx.switchToHttp().getRequest();
        const authorization: string = req.headers['authorization'];

        if (!authorization) {
            throw new UnauthorizedException();
        }

        const bearer: string[] = authorization.split(' ');

        if (!bearer || bearer.length < 2) {
            throw new UnauthorizedException();
        }

        const token: string = bearer[1];

        const data: CommonRes = await this.authService.validateToken({token: token, type: 'ACCESS'});

        // if (!data.success) {
        //     throw new UnauthorizedException();
        // }

        req[this.globalConstants.get('var_name_user_after_decode_token')] = data.data; // No more error here

        return true;
    }
}
