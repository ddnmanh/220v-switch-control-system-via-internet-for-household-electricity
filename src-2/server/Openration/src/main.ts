import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.MQTT,
        options: {
            url: process.env.MQTT_BROKER_ADDRESS || 'mqtt://localhost',
            clientId: process.env.MQTT_BROKER_CLIENT_ID || 'server-1209368761874',
            username: process.env.MQTT_BROKER_USERNAME || 'serverUsername',
            password: process.env.MQTT_BROKER_PASSWORD || 'serverPassword',
            connectTimeout: 10000,
            reconnectPeriod: 3000,
            keepalive: 60,
            clean: true,
        },
    });

    await app.listen();
    console.log('NestJS MQTT Client is listening...');

}

bootstrap();
