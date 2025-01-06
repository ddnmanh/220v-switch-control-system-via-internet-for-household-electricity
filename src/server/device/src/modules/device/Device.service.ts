import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrServiceRes, ServiceRes } from 'src/DTO/serviceRes.dto';
import { GetDeviceInfoReq } from '../../proto/device.pb';
import { DeviceRepository } from './repository/Device.repository';

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

    // async registerUser(body: RegisterUserDto): Promise<ServiceRes> {
    //     let statusMessage:ErrServiceRes[] = [];

    //     if (body.username === '' || !body.username) statusMessage.push( {property: 'username', message: 'Username must not empty'} );
    //     if (body.password === '' || !body.password) statusMessage.push( {property: 'password', message: 'Password must not empty'} );
    //     if (body.email === '' || !body.email) statusMessage.push( {property: 'email', message: 'Email must not empty'} );

    //     if (statusMessage.length > 0) {
    //         return new ServiceRes('Invalid registration information', statusMessage, null);
    //     }

    //     try {
    //         // Check if username is already taken
    //         if (await this.isExistsUserByUsername(body.username) || await this.isExistsUserRegisterByUsername(body.username)) statusMessage.push( {property: 'username', message: 'Username is already taken'} );

    //         // Check if email is already taken
    //         if (await this.isExistsUserByEmail(body.email) || await this.isExistsUserRegisterByEmail(body.email)) statusMessage.push( {property: 'email', message: 'Email is already taken'} );

    //         if (statusMessage.length > 0) {
    //             return new ServiceRes('Register user is failed', statusMessage, null);
    //         }

    //         // Hash password before saving to database
    //         // body.password = await this.encryptService.hashPassword(body.password);

    //         let userRegister = await this.userRegiterRepository.createOne(body.firstname, body.lastname, body.username, body.password, body.email);

    //         let userRegisterRes = new UserRegisterResDTO();
    //         userRegisterRes.id = userRegister.id;
    //         userRegisterRes.firstname = userRegister.firstname;
    //         userRegisterRes.lastname = userRegister.lastname;
    //         userRegisterRes.username = userRegister.username;
    //         userRegisterRes.email = userRegister.email;

    //         return new ServiceRes('Register user is successfully', statusMessage, userRegisterRes);
    //     } catch (error) {
    //         console.log(`AuthService:registerUser : ${error.message}`);
    //         return new ServiceRes('Error when register user', [{ property: 'error', message: error.message }], null);
    //     }
    // }

    // Check if username is already taken
    // private async isExistsUserByUsername(username: string = ''): Promise<boolean> {
    //     if (username === '') return false;

    //     if (await this.userRepository.countUserByUsername(username) === 0) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    // // Check if email is already taken
    // private async isExistsUserByEmail(email: string = ''): Promise<boolean> {
    //     if (email === '') return false;

    //     if (await this.userRepository.countUserByEmail(email)) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // // Check if username is already taken
    // private async isExistsUserRegisterByUsername(username: string = ''): Promise<boolean> {
    //     if (username === '') return false;

    //     if (await this.userRegiterRepository.countUserByUsername(username) === 0) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    // // Check if email is already taken
    // private async isExistsUserRegisterByEmail(email: string = ''): Promise<boolean> {
    //     if (email === '') return false;

    //     if (await this.userRegiterRepository.countUserByEmail(email)) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

}
