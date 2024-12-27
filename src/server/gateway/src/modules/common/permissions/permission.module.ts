import { Module } from '@nestjs/common';
import { CheckPermissions } from './check-permissions.service';
import { RoleGuard } from '../guard/role.guard';

@Module({
    imports: [],
    controllers: [],
    providers: [
        CheckPermissions,
        RoleGuard,
    ],
    exports: [
        CheckPermissions,
        RoleGuard,
    ],
})

export class PermissionModule {}
