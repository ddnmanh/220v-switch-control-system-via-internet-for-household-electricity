import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HouseRepository } from '../repositorys/House.repository';
import { CreateHouseReq, DeleteHouseReq, GetHouseReq, UpdateHouseReq } from 'src/proto/house.pb';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';

@Injectable()
export class HouseService {

    private readonly globalConstants: ConfigService;
    private readonly houseRepository: HouseRepository;

    constructor(
        dR: HouseRepository, gC: ConfigService
    ) {
        this.houseRepository = dR;
        this.globalConstants = gC;
    }

    async createHouse(body: CreateHouseReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        try {
            let newHouse = new HouseEntity();
            newHouse.idUser = body.idUser;
            newHouse.name = body.name ? body.name : 'Nhà Của Tôi';
            newHouse.desc = body.desc;
            newHouse.setting = new SettingEntity();
            newHouse.setting.wallpaperBlur = body.isWallpaperBlur ? 1 : 0;

            let houseResult = await this.houseRepository.createHouse(newHouse);

            return new ServiceRes('Create house is successfully', statusMessage, houseResult);
        } catch (error) {
            console.log(`HouseService:createHouse : ${error.message}`);
            return new ServiceRes('Error when create house', [{ property: 'error', message: error.message }], null);
        }
    }

    async getHouse(body: GetHouseReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        // Không kiểm tra body.houseId vì có thể không có houseId
        // houseId == null => lấy tất cả house của user
        // houseId != null => lấy house theo id

        try {
            let houseResult = null;

            if (!body.houseId) {
                houseResult = await this.houseRepository.getAllHouseWithRelationsByIdUser(body.idUser);
            } else if (body.houseId.length == 6) {
                houseResult = await this.houseRepository.getHouseWithRelationsByIdUser(body.houseId, body.idUser);
            }

            return new ServiceRes('Get house is successfully', statusMessage, houseResult);
        } catch (error) {
            console.log(`HouseService:getHouse : ${error.message}`);
            return new ServiceRes('Error when get house', [{ property: 'error', message: error.message }], null);
        }
    }


    async updateHouse(body: UpdateHouseReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.houseId) {
            statusMessage.push({ property: 'houseId', message: 'houseId is required' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }

        if (body.houseId.length != 6) {
            statusMessage.push({ property: 'houseId', message: 'houseId is invalid' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }

        try {

            let updateHouse = await this.houseRepository.getHouseByIdByIdUser(body.idUser, body.houseId);

            if (!updateHouse) {
                statusMessage.push({ property: 'houseId', message: 'houseId is not found' });
                return new ServiceRes('Error when update house', statusMessage, null);
            }

            updateHouse.name = body.name;
            updateHouse.desc = body.desc;
            updateHouse.setting = new SettingEntity();
            updateHouse.setting.wallpaperBlur = body.isWallpaperBlur ? 1 : 0;
            updateHouse.setting.isMainHouse = body.isMainHouse ? 1 : 0;

            let houseResult = await this.houseRepository.updateHouse(updateHouse);

            return new ServiceRes('Update house is successfully', statusMessage, houseResult);
        } catch (error) {
            console.log(`HouseService:updateHouse : ${error.message}`);
            return new ServiceRes('Error when update house', [{ property: 'error', message: error.message }], null);
        }
    }


    async deleteHouse(body: DeleteHouseReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.houseId) {
            statusMessage.push({ property: 'houseId', message: 'houseId is required' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }

        if (body.houseId.length != 6) {
            statusMessage.push({ property: 'houseId', message: 'houseId is invalid' });
            return new ServiceRes('Error when get house', statusMessage, null);
        }

        try {
            let deleteHouse = await this.houseRepository.getHouseByIdByIdUser(body.idUser, body.houseId);

            if (!deleteHouse) {
                statusMessage.push({ property: 'houseId', message: 'houseId is not found' });
                return new ServiceRes('Error when delete house', statusMessage, null);
            }

            await this.houseRepository.softDeleteHouseWithRelations(body.houseId, body.idUser);

            return new ServiceRes('Delete house is successfully', statusMessage, null);
        } catch (error) {
            console.log(`HouseService:deleteHouse : ${error.message}`);
            return new ServiceRes('Error when delete house', [{ property: 'error', message: error.message }], null);
        }
    }

}
