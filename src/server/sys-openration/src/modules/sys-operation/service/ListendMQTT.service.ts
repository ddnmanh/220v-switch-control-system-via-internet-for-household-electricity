import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HistoryOperationRepository } from '../HistoryOperation.repository';
import { connect, MqttClient } from 'mqtt';

@Injectable()
export class ListendMQTTService implements OnModuleInit {

    private readonly logger = new Logger(ListendMQTTService.name);
    private client: MqttClient;

    constructor(
        private readonly historyOperationRepository: HistoryOperationRepository,
        private readonly configService: ConfigService,
    ) {}

    onModuleInit() {
        this.connectToBroker();
    }

    private connectToBroker() {

        this.client = connect(
            this.configService.get<string>('mqtt_address'),
            {
                username: this.configService.get<string>('mqtt_username'),
                password: this.configService.get<string>('mqtt_password'),
                clientId: this.configService.get<string>('mqtt_client_id'),
            }
        );

        this.client.on('connect', () => {
            this.logger.log('Connected to MQTT broker');
            this.subscribeToTopics();
        });

        this.client.on('error', (err) => {
            this.logger.error(`Connection error: ${err}`);
        });

        this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message.toString());
        });
    }

    private subscribeToTopics() {
        const topic = '#';
        this.client.subscribe(topic, (err) => {
            if (err) {
                this.logger.error(`Failed to subscribe to topic ${topic}`);
            } else {
                this.logger.log(`Subscribed to topic ${topic}`);
            }
        });
    }

    private handleMessage(topic: string, message: string) {
        this.logger.log(`Received message on topic ${topic}: ${message}`);

        try {
            let messageData = JSON.parse(message);

            if (messageData.type == 'CONTROLL_RES' || messageData.type == 'NOTI') {
                let idHouse = topic.split('/')[0];
                let idDevice = topic.split('/')[1];

                this.historyOperationRepository.createHistoryOperation(idHouse, idDevice, messageData.value);
            }
        } catch (error) {
            this.logger.error(`Error when parsing message: ${error}`);
        }
    }
}
