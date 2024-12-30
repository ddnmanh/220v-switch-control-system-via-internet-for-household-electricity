import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/User.repository';
import { EncryptService } from '../../common/encrypt/Encrypt.service';
import { ConfigService } from '@nestjs/config';
import UserEntity, { UserRole } from 'src/entity/User.entity';
import { LogInHistoryRepository } from '../repository/LogInHistory.repository';
import { RefreshTokenDto } from 'src/DTO/refresh-token.dto';
import { JWTService } from './JWT.service';
import { ErrServiceRes, ServiceRes } from 'src/DTO/ServiceRes.dto';
import { RegisterUserDto, ResendOTPVerifyRegisterAccountReq, OTPVerifyRegisterAccountReq, UserResDTO } from 'src/DTO/user.dto';
import { SignInDto } from 'src/DTO/auth.dto';
import { UserRegisterRepository } from '../repository/UserRegister.repository';
import UserRegiterEntity from 'src/entity/UserRegister.entity';
import { EmailService } from 'src/modules/common/email/Email.service';
import { OTPRepository } from '../repository/OTP.repository';
import OTPEntity from 'src/entity/OTP.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';
import { UserRegisterResDTO } from 'src/DTO/userRegister.dto';

@Injectable()
export class AuthService {

    private readonly userRepository: UserRepository;
    private readonly otpRepository: OTPRepository;
    private readonly logInHistoryRepository: LogInHistoryRepository;
    private readonly encryptService: EncryptService;
    private readonly jwtService: JWTService;
    private readonly emailService: EmailService;
    private readonly globalConstants: ConfigService;
    private readonly userRegiterRepository: UserRegisterRepository;
    private readonly GenerateUUIDService: GenerateUUIDService;

    constructor(aR: UserRepository, otpR: OTPRepository, uRR: UserRegisterRepository, rTR: LogInHistoryRepository, eS: EncryptService, jS: JWTService, emS: EmailService, gC: ConfigService, gUS: GenerateUUIDService) {
        this.userRepository = aR;
        this.otpRepository = otpR;
        this.userRegiterRepository = uRR;
        this.logInHistoryRepository = rTR;
        this.encryptService = eS;
        this.jwtService = jS;
        this.emailService = emS;
        this.globalConstants = gC;
        this.GenerateUUIDService = gUS;
    }

    async registerUser(body: RegisterUserDto): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        if (body.username === '' || !body.username) statusMessage.push( {property: 'username', message: 'Username must not empty'} );
        if (body.password === '' || !body.password) statusMessage.push( {property: 'password', message: 'Password must not empty'} );
        if (body.email === '' || !body.email) statusMessage.push( {property: 'email', message: 'Email must not empty'} );

        if (statusMessage.length > 0) {
            return new ServiceRes('Invalid registration information', statusMessage, null);
        }

        try {
            // Check if username is already taken
            if (await this.isExistsUserByUsername(body.username) || await this.isExistsUserRegisterByUsername(body.username)) statusMessage.push( {property: 'username', message: 'Username is already taken'} );

            // Check if email is already taken
            if (await this.isExistsUserByEmail(body.email) || await this.isExistsUserRegisterByEmail(body.email)) statusMessage.push( {property: 'email', message: 'Email is already taken'} );

            if (statusMessage.length > 0) {
                return new ServiceRes('Register user is failed', statusMessage, null);
            }

            // Hash password before saving to database
            body.password = await this.encryptService.hashPassword(body.password);

            let userRegister = await this.userRegiterRepository.createOne(body.firstname, body.lastname, body.username, body.password, body.email);

            let userRegisterRes = new UserRegisterResDTO();
            userRegisterRes.id = userRegister.id;
            userRegisterRes.firstname = userRegister.firstname;
            userRegisterRes.lastname = userRegister.lastname;
            userRegisterRes.username = userRegister.username;
            userRegisterRes.email = userRegister.email;

            return new ServiceRes('Register user is successfully', statusMessage, userRegisterRes);
        } catch (error) {
            console.log(`AuthService:registerUser : ${error.message}`);
            return new ServiceRes('Error when register user', [{ property: 'error', message: error.message }], null);
        }
    }

    async sendEmailOTP(userRegister: UserRegiterEntity): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        try {
            const otp = Math.floor(100000 + Math.random() * 900000);  // Tạo số ngẫu nhiên trong phạm vi 100000-999999

            // const sendEmailSuccess = true;
            const sendEmailSuccess = await this.emailService.sendOTPVerifyRegisterAccount(userRegister.email, otp.toString());


            if (sendEmailSuccess) {
                await this.otpRepository.deleteAllByIdUserRegister(userRegister);
                this.otpRepository.saveOne(userRegister, otp.toString());
            }

            return new ServiceRes('Send OTP is successfully', statusMessage, null);
        } catch (error) {
            console.log(`AuthService:registerUser : ${error.message}`);
            return new ServiceRes('Error when send OTP', [{ property: 'error', message: error.message }], null);
        }
    }

    async resendOTPVerifyRegisterAccount(body: ResendOTPVerifyRegisterAccountReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];
        try {
            let userWaitVerify = await this.userRegiterRepository.findByIdByEmail(body.idRegister, body.email);
            if (!userWaitVerify) {
                statusMessage.push( {property: 'error', message: 'User is not found'} );
                return new ServiceRes('Error when resend OTP', statusMessage, null);
            }
            await this.sendEmailOTP(userWaitVerify);
            return new ServiceRes('Resend OTP to verify account register is successfully', statusMessage, null);
        } catch (error) {
            console.log(`AuthService:resendOTPVerifyRegisterAccount : ${error.message}`);
            return new ServiceRes('Error when resend OTP', [{ property: 'error', message: error.message }], null);
        }
    }

    async otpVerifyRegisterAccount(body: OTPVerifyRegisterAccountReq): Promise<ServiceRes> {
        let statusMessage:ErrServiceRes[] = [];

        console.log("otpVerifyRegisterAccount");
        console.log(body);



        try {
            let userVerify = await this.userRegiterRepository.findUserWithOtpByEmail(body.email);

            if (!userVerify) {
                statusMessage.push( {property: 'email', message: 'Cannot found user register by email!'} );
            }

            let isMatchOTP = false;
            userVerify?.otpRelation?.forEach((otp: OTPEntity) => {
                if (otp.otp === body.otp) {
                    isMatchOTP = true;
                }
            });

            if (!isMatchOTP) {
                statusMessage.push( {property: 'otp', message: 'OTP is incorrect'} );
            }

            if (statusMessage.length > 0) {
                return new ServiceRes('Verify account register is failed', statusMessage, null);
            }

            let user = await this.userRepository.createOne(userVerify.firstname, userVerify.lastname, userVerify.username, userVerify.password, userVerify.email, UserRole.USER);

            if (user) {
                await this.userRegiterRepository.deleteUserRegister(userVerify);
                let userRes = new UserResDTO();
                userRes.id = user.id;
                userRes.username = user.username;
                userRes.email = user.email;
                userRes.role = user.role;
                return new ServiceRes('Verify account register is successfully', statusMessage, userRes);
            } else {
                throw new Error('Cannot create user from user register');
            }


        } catch (error) {
            console.log(`AuthService:otpVerifyRegisterAccount : ${error.message}`);
            return new ServiceRes('Error when Verify account register', [{ property: 'error', message: error.message }], null);
        }
    }



    // Check if username is already taken
    private async isExistsUserByUsername(username: string = ''): Promise<boolean> {
        if (username === '') return false;

        if (await this.userRepository.countUserByUsername(username) === 0) {
            return false;
        } else {
            return true;
        }
    }

    // Check if email is already taken
    private async isExistsUserByEmail(email: string = ''): Promise<boolean> {
        if (email === '') return false;

        if (await this.userRepository.countUserByEmail(email)) {
            return true;
        } else {
            return false;
        }
    }

    // Check if username is already taken
    private async isExistsUserRegisterByUsername(username: string = ''): Promise<boolean> {
        if (username === '') return false;

        if (await this.userRegiterRepository.countUserByUsername(username) === 0) {
            return false;
        } else {
            return true;
        }
    }

    // Check if email is already taken
    private async isExistsUserRegisterByEmail(email: string = ''): Promise<boolean> {
        if (email === '') return false;

        if (await this.userRegiterRepository.countUserByEmail(email)) {
            return true;
        } else {
            return false;
        }
    }

}
