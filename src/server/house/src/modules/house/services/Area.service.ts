import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HouseRepository } from '../repositorys/House.repository';
import { CreateAreaReq, DeleteAreaReq, GetAreaReq, UpdateAreaReq } from 'src/proto/house.pb';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';
import HouseEntity from 'src/entity/House.entity';
import SettingEntity from 'src/entity/Setting.entity';
import AreaEntity from 'src/entity/Area.entity';
import { AreaRepository } from '../repositorys/Area.repository';

@Injectable()
export class AreaService {

    private readonly globalConstants: ConfigService;
    private readonly houseRepository: HouseRepository;
    private readonly areaRepository: AreaRepository;

    constructor(
        dR: HouseRepository, gC: ConfigService,
        aR: AreaRepository
    ) {
        this.houseRepository = dR;
        this.globalConstants = gC;
        this.areaRepository = aR;
    }

    async createArea(body: CreateAreaReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        console.log('AreaService:createArea : ', body);


        try {
            let houseDb = await this.houseRepository.getHouseByIdByIdUser(body.idUser, body.idHouse);

            if (!houseDb) {
                statusMessage.push({ property: 'house', message: 'House is not found' });
                return new ServiceRes('House is not found', statusMessage, null);
            }

            let newArea = new AreaEntity();
            newArea.house = houseDb;
            newArea.name = body.name;
            newArea.desc = body.desc;

            let areaResult = await this.areaRepository.createArea(newArea);

            delete areaResult.house;

            return new ServiceRes('Create house is successfully', statusMessage, areaResult);
        } catch (error) {
            console.log(`HouseService:createHouse : ${error.message}`);
            return new ServiceRes('Error when create house', [{ property: 'error', message: error.message }], null);
        }
    }

    async getArea(body: GetAreaReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.areaId) {
            statusMessage.push({ property: 'areaId', message: 'areaId is required' });
            return new ServiceRes('Error when get area', statusMessage, null);
        }

        if (body.areaId.length != 6) {
            statusMessage.push({ property: 'areaId', message: 'areaId is invalid' });
            return new ServiceRes('Error when get area', statusMessage, null);
        }

        try {

            if (!await this.areaRepository.isAreaBelongToUser(body.areaId, body.idUser)) {
                statusMessage.push({ property: 'area', message: 'Area is not belong to user' });
                return new ServiceRes('Area is not belong to user', statusMessage, null);
            }

            let areaResult = await this.areaRepository.getAreaWithOwnDevices(body.areaId);

            return new ServiceRes('Get area is successfully', statusMessage, areaResult);
        } catch (error) {
            console.log(`AreaService:getArea : ${error.message}`);
            return new ServiceRes('Error when get area', [{ property: 'error', message: error.message }], null);
        }
    }

    async updateArea(body: UpdateAreaReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.areaId) {
            statusMessage.push({ property: 'areaId', message: 'areaId is required' });
            return new ServiceRes('Error when update area', statusMessage, null);
        }

        if (body.areaId.length != 6) {
            statusMessage.push({ property: 'areaId', message: 'areaId is invalid' });
            return new ServiceRes('Error when update area', statusMessage, null);
        }

        try {

            if (!await this.areaRepository.isAreaBelongToUser(body.areaId, body.idUser)) {
                statusMessage.push({ property: 'area', message: 'Area is not belong to user' });
                return new ServiceRes('Area is not belong to user', statusMessage, null);
            }

            let updateArea = await this.areaRepository.getAreaById(body.areaId);

            if (!updateArea) {
                statusMessage.push({ property: 'areaId', message: 'areaId is not found' });
                return new ServiceRes('Error when update area', statusMessage, null);
            }

            updateArea.name = body.name;
            updateArea.desc = body.desc;

            let areaResult = await this.areaRepository.updateArea(updateArea);

            return new ServiceRes('Update area is successfully', statusMessage, areaResult);
        } catch (error) {
            console.log(`AreaService:updateArea : ${error.message}`);
            return new ServiceRes('Error when update area', [{ property: 'error', message: error.message }], null);
        }
    }

    async deleteArea(body: DeleteAreaReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        console.log('AreaService:deleteArea : ', body);


        if (!body.areaId) {
            statusMessage.push({ property: 'areaId', message: 'areaId is required' });
            return new ServiceRes('Error when delete area', statusMessage, null);
        }

        if (body.areaId.length != 6) {
            statusMessage.push({ property: 'areaId', message: 'areaId is invalid' });
            return new ServiceRes('Error when delete area', statusMessage, null);
        }

        try {

            if (!await this.areaRepository.isAreaBelongToUser(body.areaId, body.idUser)) {
                statusMessage.push({ property: 'area', message: 'Area is not belong to user' });
                return new ServiceRes('Area is not belong to user', statusMessage, null);
            }

            let deleteArea = await this.areaRepository.getAreaById(body.areaId);

            if (!deleteArea) {
                statusMessage.push({ property: 'areaId', message: 'areaId is not found' });
                return new ServiceRes('Error when delete area', statusMessage, null);
            }

            let areaResult = await this.areaRepository.softDeleteAreaWithRelations(body.areaId);

            return new ServiceRes('Delete area is successfully', statusMessage, areaResult);
        } catch (error) {
            console.log(`AreaService:deleteArea : ${error.message}`);
            return new ServiceRes('Error when delete area', [{ property: 'error', message: error.message }], null);
        }
    }

}
