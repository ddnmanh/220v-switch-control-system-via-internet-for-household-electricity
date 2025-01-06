import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';
import { CreateDeviceReq, DeleteDeviceReq, GetDeviceInfoReq, UpdateDeviceReq } from '../../proto/device.pb';
import { DeviceRepository } from './repository/Device.repository';
import DeviceEntity, { DeviceType } from 'src/entity/Device.entity';
import DeviceAPEntity from 'src/entity/DeviceAP.entity';

@Injectable()
export class DeviceService {

    private readonly globalConstants: ConfigService;
    private readonly deviceRepository: DeviceRepository;

    constructor(
        dR: DeviceRepository, gC: ConfigService
    ) {
        this.deviceRepository = dR;
        this.globalConstants = gC;
    }

    async createDevice(body: CreateDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (body.type.trim() === '' || !body.type) {
            statusMessage.push( {property: 'type', message: 'Type of device must not empty'} )
            return new ServiceRes('Invalid device information', statusMessage, null);
        }

        if (!Object.values(DeviceType).includes(body.type as DeviceType)) {
            statusMessage.push( {property: 'type', message: 'Type of device is invalid'} )
            return new ServiceRes('Invalid device information', statusMessage, null);
        }

        try {

            let device = new DeviceEntity();
            device.name = body.name;
            device.type = body.type as DeviceType;
            device.desc = body.desc;
            device.deviceAP = new DeviceAPEntity();
            device.deviceAP.apPassword = Math.floor(10000000 + Math.random() * 90000000).toString();


            let deviceResul = await this.deviceRepository.createDevice(device);

            return new ServiceRes('Create device is successfully', statusMessage, deviceResul);
        } catch (error) {
            console.log(`DeviceService:createDevice : ${error.message}`);
            return new ServiceRes('Error when create device', [{ property: 'error', message: error.message }], null);
        }
    }

    async getDeviceInfo(payload: GetDeviceInfoReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (payload.deviceId === '' || !payload.deviceId) {
            statusMessage.push( {property: 'deviceId', message: 'Device ID must not empty'} )
            return new ServiceRes('Invalid device information', statusMessage, null);
        }

        try {
            let device = await this.deviceRepository.getDeviceById(payload.deviceId);

            return new ServiceRes('Get device information is successfully', statusMessage, device);
        } catch (error) {
            console.log(`DeviceService:getDeviceInfo : ${error.message}`);
            return new ServiceRes('Error when get device information', [{ property: 'error', message: error.message }], null);
        }
    }

    async updateDevice(payload: UpdateDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (payload.deviceId === '' || !payload.deviceId) {
            statusMessage.push( {property: 'deviceId', message: 'Device ID must not empty'} )
            return new ServiceRes('Invalid device information', statusMessage, null);
        }

        if (payload.apPassword === '' || !payload.apPassword) {
            statusMessage.push( {property: 'apPassword', message: 'AP Password must not empty'} )
            return new ServiceRes('Invalid device information', statusMessage, null);
        }

        if (payload.apPassword.length > 10 || payload.apPassword.length <3) {
            statusMessage.push( {property: 'apPassword', message: 'AP Password must from 3 to 10 characters'} )
            return new ServiceRes('Invalid device information', statusMessage, null);
        }

        try {
            let device = await this.deviceRepository.getDeviceById(payload.deviceId);

            if (!device) {
                statusMessage.push( {property: 'deviceId', message: 'Device ID is not exists'} )
                return new ServiceRes('Invalid device information', statusMessage, null);
            }

            device.name = payload.name;
            device.desc = payload.desc;
            device.deviceAP.apPassword = payload.apPassword;

            let deviceResul = await this.deviceRepository.updateDevice(device);

            return new ServiceRes('Update device is successfully', statusMessage, deviceResul);
        } catch (error) {
            console.log(`DeviceService:updateDevice : ${error.message}`);
            return new ServiceRes('Error when update device', [{ property: 'error', message: error.message }], null);
        }
    }

    async deleteDevice(payload: DeleteDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (payload.deviceId === '' || !payload.deviceId) {
            statusMessage.push( {property: 'deviceId', message: 'Device ID must not empty'} )
            return new ServiceRes('Invalid device information', statusMessage, null);
        }


        try {
            let device = await this.deviceRepository.deleteDeviceById(payload.deviceId);

            return new ServiceRes('Delete device is successfully', statusMessage, device);
        } catch (error) {
            console.log(`DeviceService:deleteDevice : ${error.message}`);
            return new ServiceRes('Error when delete device', [{ property: 'error', message: error.message }], null);
        }
    }


}
