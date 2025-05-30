import { Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Ctx, MessagePattern, MqttContext, Payload } from "@nestjs/microservices";
import { HistoryOperationRepository } from "./HistoryOperation.repository";

@Controller()
export class ListendController {

    constructor(
        private readonly historyOperationRepository: HistoryOperationRepository,
        private readonly configService: ConfigService,
    ) {}

    @MessagePattern('#')
    handleMqttMessage(@Payload() messageData: any, @Ctx() context: MqttContext) {
        console.log('Received MQTT message:', messageData);
        console.log('Topic:', context.getTopic());
        // console.log(context);

        try {

            if (messageData?.type === 'CONTROLL_RES' || messageData?.type === 'NOTI') {

                const [idHouse, idDevice] = context.getTopic().split('/');

                // console.log('idHouse:', idHouse, idHouse.length);
                // console.log('idDevice:', idDevice, idDevice.length);


                if (idHouse && idDevice && messageData['value'] !== undefined) {
                    this.historyOperationRepository.createHistoryOperation(idHouse, idDevice, messageData.value);
                } else {
                    console.warn(`Invalid topic format: ${context.getTopic()}`);
                }
            }
        } catch (error) {
            console.warn(`Error parsing message: ${error.message}`);
        }
    }

}
