import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HouseRepository } from '../repositorys/House.repository';
import { CreateOwnDeviceReq, DeleteOwnDeviceReq, UpdateOwnDeviceReq } from 'src/proto/house.pb';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';
import AreaEntity from 'src/entity/Area.entity';
import { OwnDeviceRepository } from '../repositorys/OwnDevice.repository';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';
import { AreaRepository } from '../repositorys/Area.repository';

@Injectable()
export class OwnDeviceService {

    private readonly globalConstants: ConfigService;
    private readonly houseRepository: HouseRepository;
    private readonly areaRepository: AreaRepository;
    private readonly ownDeviceRepository: OwnDeviceRepository;

    constructor(
        gC: ConfigService,
        hR: HouseRepository,
        aR: AreaRepository,
        oDR: OwnDeviceRepository
    ) {
        this.globalConstants = gC;
        this.houseRepository = hR;
        this.areaRepository = aR;
        this.ownDeviceRepository = oDR;
    }

    async createOwnDevice(body: CreateOwnDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        console.log('OwnDeviceService:createOwnDevice : ', body);

        if (!body.idDevice) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is required' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }

        if (!body.idHouse) {
            statusMessage.push({ property: 'idHouse', message: 'idHouse is required' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }

        if (!body.idArea) {
            statusMessage.push({ property: 'idArea', message: 'idArea is required' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }

        if (body.idHouse.length != 6) {
            statusMessage.push({ property: 'idHouse', message: 'idHouse is invalid' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }

        if (body.idArea.length != 6) {
            statusMessage.push({ property: 'idArea', message: 'idArea is invalid' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }

        if (body.idDevice.length != 6) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is invalid' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }


        try {

            // Kiểm tra xem house có thuộc về user không
            if (!await this.houseRepository.isHouseBelongToUser(body.idHouse, body.idUser)) {
                statusMessage.push({ property: 'house', message: 'House is not belong to user' })
               return new ServiceRes('House is not belong to user', statusMessage, null);
            }

            // Kiểm tra xem area có thuộc về user không
            if (!await this.areaRepository.isAreaBelongToUser(body.idArea, body.idUser)) {
                statusMessage.push({ property: 'area', message: 'Area is not belong to user' })
               return new ServiceRes('Area is not belong to user', statusMessage, null);
            }

            // Kiểm tra xem own device đã tồn tại chưa
            if (await this.ownDeviceRepository.isOwnDeviceExist(body.idDevice)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is already exist' })
               return new ServiceRes('Own device is already exist', statusMessage, null);
            }


            const newOwnDevice = new OwnDeviceEntity();
            newOwnDevice.idDevice = body.idDevice;
            newOwnDevice.house = new HouseEntity();
            newOwnDevice.house.id = body.idHouse;
            newOwnDevice.area = new AreaEntity();
            newOwnDevice.area.id = body.idArea;
            newOwnDevice.name = body.name ? body.name : 'Công tắc mới';
            newOwnDevice.desc = body.desc ? body.desc : '';

            const savedDevice = await this.ownDeviceRepository.createOwnDevice(newOwnDevice);

            console.log('OwnDeviceService:createOwnDevice : ', savedDevice);


            return new ServiceRes('Own device created successfully', statusMessage, savedDevice);
        } catch (error) {
            console.log(`OwnDeviceService:createOwnDevice : ${error.message}`);
            return new ServiceRes('Error when create own device', [{ property: 'error', message: error.message }], null);
        }
    }

    async updateOwnDevice(body: UpdateOwnDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        console.log('OwnDeviceService:updateOwnDevice : ', body);

        if (!body.idDevice) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is required' });
            return new ServiceRes('Error when update own device', statusMessage, null);
        }

        if (body.idDevice.length != 6) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is invalid' });
            return new ServiceRes('Error when update own device', statusMessage, null);
        }

        try {
            // Kiểm tra xem own device đã tồn tại chưa
            if (!await this.ownDeviceRepository.isOwnDeviceExist(body.idDevice)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is not exist' })
               return new ServiceRes('Own device is not exist', statusMessage, null);
            }

            // Kiểm tra xem device có thuộc về user không
            if (!await this.ownDeviceRepository.isOwnDeviceBelongToUser(body.idDevice, body.idUser)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is not belong to user' })
               return new ServiceRes('Own device is not belong to user', statusMessage, null);
            }

            let updateOwnDevice = await this.ownDeviceRepository.getOwnDeviceByIdDevice(body.idDevice);

            if (!updateOwnDevice) {
                statusMessage.push({ property: 'idDevice', message: 'idDevice is not found' });
                return new ServiceRes('Error when update own device', statusMessage, null);
            }

            updateOwnDevice.name = body.name;
            updateOwnDevice.desc = body.desc;

            let ownDeviceResult = await this.ownDeviceRepository.updateOwnDevice(updateOwnDevice);

            return new ServiceRes('Update own device is successfully', statusMessage, ownDeviceResult);

        } catch (error) {
            console.log(`OwnDeviceService:updateOwnDevice : ${error.message}`);
            return new ServiceRes('Error when update own device', [{ property: 'error', message: error.message }], null);
        }
    }

    async deleteOwnDevice(body: DeleteOwnDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        console.log('OwnDeviceService:deleteOwnDevice : ', body);

        if (!body.idDevice) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is required' });
            return new ServiceRes('Error when delete own device', statusMessage, null);
        }

        try {
            // Kiểm tra xem own device đã tồn tại chưa
            if (!await this.ownDeviceRepository.isOwnDeviceExist(body.idDevice)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is not exist' })
               return new ServiceRes('Own device is not exist', statusMessage, null);
            }

            // Kiểm tra xem own device có thuộc về user không
            if (!await this.ownDeviceRepository.isOwnDeviceBelongToUser(body.idDevice, body.idUser)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is not belong to user' })
               return new ServiceRes('Own device is not belong to user', statusMessage, null);
            }

            await this.ownDeviceRepository.deleteOwnDevice(body.idDevice);

            return new ServiceRes('Own device deleted successfully', statusMessage, null);
        } catch (error) {
            console.log(`OwnDeviceService:deleteOwnDevice : ${error.message}`);
            return new ServiceRes('Error when delete own device', [{ property: 'error', message: error.message }], null);
        }
    }
}
