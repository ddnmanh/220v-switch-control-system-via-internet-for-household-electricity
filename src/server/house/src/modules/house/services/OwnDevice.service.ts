import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HouseRepository } from '../repositorys/House.repository';
import { CreateOwnDeviceReq, DeleteOwnDeviceReq, GetOwnDeviceReq, UpdateOwnDeviceReq } from 'src/proto/house.pb';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';
import RoomEntity from 'src/entity/Room.entity';
import { OwnDeviceRepository } from '../repositorys/OwnDevice.repository';
import OwnDeviceEntity from 'src/entity/OwnDevice.entity';
import { RoomRepository } from '../repositorys/Room.repository';
import { CommonRes, DEVICE_SERVICE_NAME, DeviceServiceClient } from 'src/proto/device.pb';
import { ClientGrpc, ServerGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SYS_OPENRATION_SERVICE_NAME, SysOpenrationServiceClient } from 'src/proto/SysOpenration.pb';

@Injectable()
export class OwnDeviceService implements OnModuleInit {

    @Inject(DEVICE_SERVICE_NAME)
    private readonly deviceService: ClientGrpc;

    @Inject(SYS_OPENRATION_SERVICE_NAME)
    private readonly sysOperationService: ClientGrpc;

    private deviceSvc: DeviceServiceClient;
    private sysOperationSvc: SysOpenrationServiceClient;
    private readonly globalConstants: ConfigService;
    private readonly houseRepository: HouseRepository;
    private readonly roomRepository: RoomRepository;
    private readonly ownDeviceRepository: OwnDeviceRepository;

    constructor(
        gC: ConfigService,
        hR: HouseRepository,
        aR: RoomRepository,
        oDR: OwnDeviceRepository
    ) {
        this.globalConstants = gC;
        this.houseRepository = hR;
        this.roomRepository = aR;
        this.ownDeviceRepository = oDR;
    }

    public onModuleInit():void {
        this.deviceSvc = this.deviceService.getService<DeviceServiceClient>(DEVICE_SERVICE_NAME);
        this.sysOperationSvc = this.sysOperationService.getService<SysOpenrationServiceClient>(SYS_OPENRATION_SERVICE_NAME);
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

        // if (!body.idRoom) {
        //     statusMessage.push({ property: 'idRoom', message: 'idRoom is required' });
        //     return new ServiceRes('Error when create own device', statusMessage, null);
        // }

        if (body?.idHouse?.length != 6) {
            statusMessage.push({ property: 'idHouse', message: 'idHouse is invalid' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }

        // if (body?.idRoom?.length != 6) {
        //     statusMessage.push({ property: 'idRoom', message: 'idRoom is invalid' });
        //     return new ServiceRes('Error when create own device', statusMessage, null);
        // }

        if (body?.idDevice?.length != 6) {
            statusMessage.push({ property: 'idDevice', message: 'idDevice is invalid' });
            return new ServiceRes('Error when create own device', statusMessage, null);
        }

        // Kiểm tra xem device có tồn tại không
        try {
            let device:CommonRes = await firstValueFrom(this.deviceSvc.getDeviceInfo({ deviceId: body.idDevice }));

            if ( device.code === 200 && !device.data ) {
                statusMessage.push({ property: 'device', message: 'This device could not be identified.' })
                return new ServiceRes('This device could not be identified.', statusMessage, null);
            }
        } catch (error) {
            console.log(`OwnDeviceService:createOwnDevice : ${error.message}`);
            return new ServiceRes('Error when identified device', [{ property: 'error', message: error.message }], null);
        }

        try {

            // Kiểm tra xem house có thuộc về user không
            if (!await this.houseRepository.isHouseBelongToUser(body.idHouse, body.idUser)) {
                statusMessage.push({ property: 'house', message: 'House is not belong to user' })
               return new ServiceRes('House is not belong to user', statusMessage, null);
            }

            if (body.idRoom) {

                // Kiểm tra xem room có thuộc về house không
                if (!await this.roomRepository.isRoomBelongToHouse(body.idRoom, body.idHouse)) {
                    statusMessage.push({ property: 'room', message: 'Room is not belong to house' })
                   return new ServiceRes('Room is not belong to house', statusMessage, null);
                }

                // Kiểm tra xem room có thuộc về user không
                if (!await this.roomRepository.isRoomBelongToUser(body.idRoom, body.idUser)) {
                    statusMessage.push({ property: 'room', message: 'Room is not belong to user' })
                   return new ServiceRes('Room is not belong to user', statusMessage, null);
                }
            }

            // Kiểm tra xem device đã đang được sở hửu và sử dụng bởi một người dùng hay chưa
            if (await this.ownDeviceRepository.isDeviceUsing(body.idDevice)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is already exist' })
               return new ServiceRes('Own device is already exist', statusMessage, null);
            }


            const newOwnDevice = new OwnDeviceEntity();
            newOwnDevice.idDevice = body.idDevice;
            newOwnDevice.house = new HouseEntity();
            newOwnDevice.house.id = body.idHouse;
            newOwnDevice.room = new RoomEntity();
            newOwnDevice.room.id = body.idRoom;
            newOwnDevice.name = body.name ? body.name : 'Công tắc mới';
            newOwnDevice.desc = body.desc ? body.desc : '';

            const savedDevice = await this.ownDeviceRepository.createOwnDevice(newOwnDevice);

            return new ServiceRes('Own device created successfully', statusMessage, savedDevice);
        } catch (error) {
            console.log(`OwnDeviceService:createOwnDevice : ${error.message}`);
            return new ServiceRes('Error when create own device', [{ property: 'error', message: error.message }], null);
        }
    }

    async getOwnDevice(body: GetOwnDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.idOwnDevice) {
            statusMessage.push({ property: 'idOwnDevice', message: 'idOwnDevice is required' });
            return new ServiceRes('Error when get own device', statusMessage, null);
        }

        if (body?.idOwnDevice?.length != 6) {
            statusMessage.push({ property: 'idOwnDevice', message: 'idOwnDevice is invalid' });
            return new ServiceRes('Error when get own device', statusMessage, null);
        }

        try {
            let ownDevice = await this.ownDeviceRepository.getOwnDeviceByIdOwnDevice(body.idOwnDevice, body.idUser);

            if (!ownDevice) {
                statusMessage.push({ property: 'idOwnDevice', message: 'Own device is not found!' });
                return new ServiceRes('Error when get own device', statusMessage, null);
            }

            delete ownDevice.createdAt;
            delete ownDevice.updatedAt;

            return new ServiceRes('Get own device successfully', statusMessage, ownDevice);

        } catch (error) {
            console.log(`OwnDeviceService:getOwnDevice : ${error.message}`);
            return new ServiceRes('Error when get own device', [{ property: 'error', message: error.message }], null);
        }
    }

    async updateOwnDevice(body: UpdateOwnDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.idOwnDevice) {
            statusMessage.push({ property: 'idOwnDevice', message: 'idOwnDevice is required' });
            return new ServiceRes('Error when update own device', statusMessage, null);
        }

        if (body?.idOwnDevice?.length != 6) {
            statusMessage.push({ property: 'idOwnDevice', message: 'idOwnDevice is invalid' });
            return new ServiceRes('Error when update own device', statusMessage, null);
        }

        try {
            // Kiểm tra xem device có thuộc về và đang được sử dụng bởi user không
            if (!await this.ownDeviceRepository.isOwnDeviceBelongToUser(body.idOwnDevice, body.idUser)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is not belong to user' })
               return new ServiceRes('Own device is not belong to user', statusMessage, null);
            }

            // Lấy thông tin của own device
            let updateOwnDevice = await this.ownDeviceRepository.getOwnDeviceByIdOwnDevice(body.idOwnDevice, body.idUser);

            if (!updateOwnDevice) {
                statusMessage.push({ property: 'idOwnDevice', message: 'Own device is not found' });
                return new ServiceRes('Error when update own device', statusMessage, null);
            }

            updateOwnDevice.name = body.name;
            updateOwnDevice.desc = body.desc;
            updateOwnDevice.isSaveState = body.isSaveState === undefined ? updateOwnDevice.isSaveState : body.isSaveState;
            updateOwnDevice.isVerifyResetFromApp = body.isVerifyResetFromApp === undefined ? updateOwnDevice.isVerifyResetFromApp : body.isVerifyResetFromApp;

            console.log('OwnDeviceService:updateOwnDevice : ', body);
            console.log(body['isSaveState']);


            console.log('OwnDeviceService:updateOwnDevice : ', updateOwnDevice);


            let ownDeviceResult = await this.ownDeviceRepository.updateOwnDevice(updateOwnDevice);

            return new ServiceRes('Update own device is successfully', statusMessage, ownDeviceResult);

        } catch (error) {
            console.log(`OwnDeviceService:updateOwnDevice : ${error.message}`);
            return new ServiceRes('Error when update own device', [{ property: 'error', message: error.message }], null);
        }
    }

    async deleteOwnDevice(body: DeleteOwnDeviceReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.idOwnDevice) {
            statusMessage.push({ property: 'idOwnDevice', message: 'idOwnDevice is required' });
            return new ServiceRes('Error when delete own device', statusMessage, null);
        }

        if (body?.idOwnDevice?.length != 6) {
            statusMessage.push({ property: 'idOwnDevice', message: 'idOwnDevice is invalid' });
            return new ServiceRes('Error when delete own device', statusMessage, null);
        }

        try {
            // Kiểm tra xem device có thuộc về và đang được sử dụng bởi user không
            if (!await this.ownDeviceRepository.isOwnDeviceBelongToUser(body.idOwnDevice, body.idUser)) {
                statusMessage.push({ property: 'ownDevice', message: 'Own device is not belong to user' })
               return new ServiceRes('Own device is not belong to user', statusMessage, null);
            }


            let ownDeviceDelete = await this.ownDeviceRepository.findOneWithHouse(body.idOwnDevice);

            await firstValueFrom(this.sysOperationSvc.deleteHistoryDeviceInfo({idHouse: ownDeviceDelete.house.id, idDevice: ownDeviceDelete.idDevice}));

            await this.ownDeviceRepository.deleteOwnDevice(body.idOwnDevice);

            return new ServiceRes('Own device deleted successfully', statusMessage, null);
        } catch (error) {
            console.log(`OwnDeviceService:deleteOwnDevice : ${error.message}`);
            return new ServiceRes('Error when delete own device', [{ property: 'error', message: error.message }], null);
        }
    }
}
