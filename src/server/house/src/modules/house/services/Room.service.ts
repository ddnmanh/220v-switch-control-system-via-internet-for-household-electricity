import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HouseRepository } from '../repositorys/House.repository';
import { CreateRoomReq, DeleteRoomReq, GetRoomReq, UpdateRoomReq } from 'src/proto/house.pb';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';
import { RoomRepository } from '../repositorys/Room.repository';
import RoomEntity from 'src/entity/Room.entity';

@Injectable()
export class RoomService {

    private readonly globalConstants: ConfigService;
    private readonly houseRepository: HouseRepository;
    private readonly roomRepository: RoomRepository;

    constructor(
        dR: HouseRepository, gC: ConfigService,
        aR: RoomRepository
    ) {
        this.houseRepository = dR;
        this.globalConstants = gC;
        this.roomRepository = aR;
    }

    async createRoom(body: CreateRoomReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        try {
            let houseDb = await this.houseRepository.getHouseByIdByIdUser(body.idUser, body.idHouse);

            if (!houseDb) {
                statusMessage.push({ property: 'house', message: 'House is not found' });
                return new ServiceRes('House is not found', statusMessage, null);
            }

            let newRoom = new RoomEntity();
            newRoom.house = houseDb;
            newRoom.name = body.name ? body.name : 'Khu Vực Của Tôi';
            newRoom.desc = body.desc;

            let areaResult = await this.roomRepository.createRoom(newRoom);

            delete areaResult.house;

            return new ServiceRes('Create house is successfully', statusMessage, areaResult);
        } catch (error) {
            console.log(`HouseService:createHouse : ${error.message}`);
            return new ServiceRes('Error when create house', [{ property: 'error', message: error.message }], null);
        }
    }

    async getRoom(body: GetRoomReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.roomId) {
            statusMessage.push({ property: 'roomId', message: 'roomId is required' });
            return new ServiceRes('Error when get area', statusMessage, null);
        }

        if (body.roomId.length != 6) {
            statusMessage.push({ property: 'roomId', message: 'roomId is invalid' });
            return new ServiceRes('Error when get area', statusMessage, null);
        }

        try {

            if (!await this.roomRepository.isRoomBelongToUser(body.roomId, body.idUser)) {
                statusMessage.push({ property: 'area', message: 'Room is not belong to user' });
                return new ServiceRes('Room is not belong to user', statusMessage, null);
            }

            let areaResult = await this.roomRepository.getRoomWithOwnDevices(body.roomId);

            return new ServiceRes('Get area is successfully', statusMessage, areaResult);
        } catch (error) {
            console.log(`RoomService:getRoom : ${error.message}`);
            return new ServiceRes('Error when get area', [{ property: 'error', message: error.message }], null);
        }
    }

    async updateRoom(body: UpdateRoomReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.roomId) {
            statusMessage.push({ property: 'roomId', message: 'roomId is required' });
            return new ServiceRes('Error when update area', statusMessage, null);
        }

        if (body.roomId.length != 6) {
            statusMessage.push({ property: 'roomId', message: 'roomId is invalid' });
            return new ServiceRes('Error when update area', statusMessage, null);
        }

        try {

            if (!await this.roomRepository.isRoomBelongToUser(body.roomId, body.idUser)) {
                statusMessage.push({ property: 'area', message: 'Room is not belong to user' });
                return new ServiceRes('Room is not belong to user', statusMessage, null);
            }

            let updateRoom = await this.roomRepository.getRoomById(body.roomId);

            if (!updateRoom) {
                statusMessage.push({ property: 'roomId', message: 'roomId is not found' });
                return new ServiceRes('Error when update area', statusMessage, null);
            }

            updateRoom.name = body.name;
            updateRoom.desc = body.desc;

            let areaResult = await this.roomRepository.updateRoom(updateRoom);

            return new ServiceRes('Update area is successfully', statusMessage, areaResult);
        } catch (error) {
            console.log(`RoomService:updateRoom : ${error.message}`);
            return new ServiceRes('Error when update area', [{ property: 'error', message: error.message }], null);
        }
    }

    async deleteRoom(body: DeleteRoomReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (!body.roomId) {
            statusMessage.push({ property: 'roomId', message: 'roomId is required' });
            return new ServiceRes('Error when delete area', statusMessage, null);
        }

        if (body.roomId.length != 6) {
            statusMessage.push({ property: 'roomId', message: 'roomId is invalid' });
            return new ServiceRes('Error when delete area', statusMessage, null);
        }

        try {

            if (!await this.roomRepository.isRoomBelongToUser(body.roomId, body.idUser)) {
                statusMessage.push({ property: 'area', message: 'Room is not belong to user' });
                return new ServiceRes('Room is not belong to user', statusMessage, null);
            }

            let areaNeedDel = await this.roomRepository.getRoomById(body.roomId);

            let deleteRoomResult = await this.roomRepository.softDeleteRoomWithRelations(areaNeedDel.id);

            return new ServiceRes('Delete area is successfully', statusMessage, deleteRoomResult);
        } catch (error) {
            console.log(`RoomService:deleteRoom : ${error.message}`);
            return new ServiceRes('Error when delete area', [{ property: 'error', message: error.message }], null);
        }
    }
}
