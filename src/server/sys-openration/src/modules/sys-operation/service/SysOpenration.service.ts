import { Injectable } from '@nestjs/common';
import { HistoryOperationRepository } from '../HistoryOperation.repository';
import { GetHistoryDeviceReq } from 'src/proto/SysOpenration.pb';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';

@Injectable()
export class SysOperationService {

    private readonly historyOperationRepository: HistoryOperationRepository;

    constructor(
        hOR: HistoryOperationRepository
    ) {
        this.historyOperationRepository = hOR;
    }

    async getDeviceInfo(payload: GetHistoryDeviceReq) {
        let statusMessage:ErrServiceRes[] = [];

        if (!payload.idHouse) {
            statusMessage.push({ property: 'idHouse', message: 'idHouse is required' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }

        if (!payload.idDevice) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is required' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }

        if (payload.idHouse.length !== 6) {
            statusMessage.push({ property: 'idHouse', message: 'idHouse is not valid' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }

        if (payload.idDevice.length !== 6) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is not valid' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }


        try {

            let historyOperationDevice = await this.historyOperationRepository.getHistoryDevice(payload.idHouse, payload.idDevice);

            // Chuyển đổi thời gian về dạng chuẩn
            let dataModifyTime:any = historyOperationDevice.map((item) => {
                return {
                    ...item,
                    eventDateTime: item.eventDateTime.toISOString()
                }
            });

            return new ServiceRes('Get house is successfully', statusMessage, dataModifyTime);
        } catch (error) {
            console.log(`HouseService:getHouse : ${error.message}`);
            return new ServiceRes('Error when get house', [{ property: 'error', message: error.message }], null);
        }
    }
}
