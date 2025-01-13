import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../decorator/role.decorator';
import { UserRole } from '../../../entity/User.entity';
import { CheckPermissions } from '../permissions/check-permissions.service';
import { ConfigService } from '@nestjs/config';

export class TokenDto {
    id: number;
    role: UserRole;
}

@Injectable()
export class RoleGuard implements CanActivate {

    private readonly reflector: Reflector;
    private readonly checkPermissions: CheckPermissions;
    private readonly globalConstants: ConfigService;

    constructor( r: Reflector, aCS: CheckPermissions, gC: ConfigService ) {
        this.reflector = r;
        this.checkPermissions = aCS;
        this.globalConstants = gC;
    }

    canActivate( context: ExecutionContext ) : boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const token = request[this.globalConstants.get('var_name_user_after_decode_token')] as TokenDto;

        for (let role of requiredRoles) {
            const result = this.checkPermissions.isAuthorized({
                requiredRole: role,
                currentRole: token.role,
            });

            if (result) {
                return true;
            }
        }

        throw new ForbiddenException('You do not have permission to access this resource');
    }
}
