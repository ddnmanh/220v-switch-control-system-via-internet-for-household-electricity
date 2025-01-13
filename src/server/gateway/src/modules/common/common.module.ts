import { Module } from '@nestjs/common';
import { PermissionModule } from './permissions/permission.module';
import { EnvModule } from './env/env.module';
import { JwtService } from '@nestjs/jwt';
import { MyConfigVariableGlobalModule } from './config/config.module';
import { AuthGuard } from './guard/auth.guard';
import { VerifyAccessTokenInCookieGuard } from './guard/verify-access-token-in-cookie.guard';
import { VerifyRefreshTokenInCookieGuard } from './guard/verify-refresh-token-in-cookie.guard';
import { VerifyTokenInBearerGuard } from './guard/verify-token-in-bearer.guard';

@Module({
    imports: [
        MyConfigVariableGlobalModule,
        EnvModule,
        PermissionModule,
    ],
    controllers: [],
    providers: [
        AuthGuard,
        JwtService,
        VerifyAccessTokenInCookieGuard,
        VerifyRefreshTokenInCookieGuard,
        VerifyTokenInBearerGuard
    ],
    exports: [
        MyConfigVariableGlobalModule,
        EnvModule,
        PermissionModule,
        AuthGuard,
        JwtService,
        VerifyAccessTokenInCookieGuard,
        VerifyRefreshTokenInCookieGuard,
        VerifyTokenInBearerGuard
    ],
})

export class CommonModule {}
