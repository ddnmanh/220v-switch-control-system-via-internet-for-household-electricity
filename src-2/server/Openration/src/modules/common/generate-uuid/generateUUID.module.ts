import { Module } from '@nestjs/common';
import { GenerateUUIDService } from './GenerateUUID.service';

@Module({
    imports: [ ],
    controllers: [],
    providers: [
        GenerateUUIDService,
    ],
    exports: [
        GenerateUUIDService,
    ],
})

export class GenerateUUIDModule {}
