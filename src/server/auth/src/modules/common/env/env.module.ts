import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

// Determine the environment-specific file paths
const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.share'),
];

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: envPaths, // Load .env files in the order specified
            isGlobal: true,       // Make the ConfigService available globally
        }),
    ],
})
export class EnvModule {}
