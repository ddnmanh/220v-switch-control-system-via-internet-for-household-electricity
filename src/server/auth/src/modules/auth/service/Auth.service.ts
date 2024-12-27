import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/User.repository';
import { EncryptService } from '../../common/encrypt/Encrypt.service';
import { ConfigService } from '@nestjs/config';
import UserEntity from 'src/entity/User.entity';
import { RefreshTokenRepository } from '../repository/RefreshToken.repository';
import { RefreshTokenDto } from 'src/DTO/refresh-token.dto';
import { JWTService } from './JWT.service';
import { ErrServiceRes, ServiceRes } from 'src/DTO/ServiceRes.dto';
import { RegisterUserDto } from 'src/DTO/user.dto';
import { SignInDto } from 'src/DTO/auth.dto';

@Injectable()
export class AuthService {

    private readonly userRepository: UserRepository;
    private readonly refreshTokenRepository: RefreshTokenRepository;
    private readonly encryptService: EncryptService;
    private readonly jwtService: JWTService;
    private readonly globalConstants: ConfigService;

    constructor(aR: UserRepository, rTR: RefreshTokenRepository, eS: EncryptService, jS: JWTService, gC: ConfigService) {
        this.userRepository = aR;
        this.refreshTokenRepository = rTR;
        this.encryptService = eS;
        this.jwtService = jS;
        this.globalConstants = gC;
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
            if (await this.isExistsUserByUsername(body.username)) statusMessage.push( {property: 'username', message: 'Username is already taken'} );

            // Check if email is already taken
            if (await this.isExistsUserByEmail(body.email)) statusMessage.push( {property: 'email', message: 'Email is already taken'} );

            if (statusMessage.length > 0) {
                return new ServiceRes('Register user is failed', statusMessage, null);
            }

            // Hash password before saving to database
            body.password = await this.encryptService.hashPassword(body.password);

            return new ServiceRes('Register user is successfully', statusMessage, await this.userRepository.createOne(body.username, body.password, body.email));
        } catch (error) {
            console.log(`AuthService:registerUser : ${error.message}`);
            return new ServiceRes('Error when register user', [{ property: 'error', message: error.message }], null);
        }
    }

    async signIn(body: SignInDto): Promise<ServiceRes> {

        let statusMessage:ErrServiceRes[] = [];

        if (body.username === '' || !body.username) statusMessage.push( {property: 'username', message: 'Username must not empty'} );
        if (body.password === '' || !body.password) statusMessage.push( {property: 'password', message: 'Password must not empty'} );

        if (statusMessage.length > 0) {
            return new ServiceRes('Sign-in information is invalid', statusMessage, null);
        }

        try {

            const user = await this.userRepository.findOneByUsername(body.username);

            if (!user) { // Username is incorrect
                statusMessage.push( {property: 'username', message: 'Username is incorrect'} );
            } else if (!await this.encryptService.comparePasswordHashed(body.password, user.password)) { // Password is incorrect
                statusMessage.push( {property: 'password', message: 'Password is incorrect'} );
            }

            if (statusMessage.length > 0) {
                return new ServiceRes('Sign-in information is invalid', statusMessage, null);
            }

            // Destructure user to remove sensitive or unnecessary fields
            let { password, isDelete, createdAt, ...userInfoModified } = user as UserEntity;

            // Generate access token and refresh token
            const [access_token, refresh_token] = await Promise.all([
                this.jwtService.generaAccessToken(userInfoModified),
                this.jwtService.generaRefreshToken(userInfoModified)
            ]);

            // Save refresh token to database
            let row_refreshTokenEntity = await this.saveRefreshToken(user.id, refresh_token);

            return new ServiceRes(
                'Sign-in successfully',
                statusMessage,
                {
                    accessToken: {
                        token: access_token,
                        expiresIn: this.globalConstants.get('access_token_seconds_live')
                    },
                    refreshToken: {
                        token: row_refreshTokenEntity.token,
                        expiresIn: this.globalConstants.get('refresh_token_seconds_live')
                    }
                }
            );
        } catch (error) {
            console.log(`AuthService:signIn : ${error.message}`);
            return new ServiceRes('Error when sign-in', [{ property: 'error', message: error.message }], null);
        }
    }

    async signOut(user_id: number, refresh_token: string): Promise<boolean> {
        try {
            await this.refreshTokenRepository.softDeleteRefreshToken(user_id, refresh_token);
            return true;
        } catch (error) {
            console.log(`AuthService:signOut : ${error.message}`);
            return false;
        }
    }

    async saveRefreshToken(user_id: number, refresh_token: string): Promise<RefreshTokenDto> {

        let success = await this.refreshTokenRepository.createOne(user_id, refresh_token);

        let row = new RefreshTokenDto();

        if (success.token === undefined) {
            return row;
        }

        // convert RefreshToken entity to RefreshTokenDto
        row.id = success.id;
        row.idUser = success.user.id;
        row.token = success.token;
        row.createdAt = success.createdAt;
        row.updatedAt = success.updatedAt;

        return row;
    }

    // Check if username is already taken
    public async isExistsUserByUsername(username: string = ''): Promise<boolean> {
        if (username === '') return false;

        if (await this.userRepository.countUserByUsername(username) === 0) {
            return false;
        } else {
            return true;
        }
    }

    // Check if email is already taken
    public async isExistsUserByEmail(email: string = ''): Promise<boolean> {
        if (email === '') return false;

        if (await this.userRepository.countUserByEmail(email)) {
            return true;
        } else {
            return false;
        }
    }

}
