import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class JWTService {

    private readonly jwtService: JwtService;
    private readonly globalConstants: ConfigService;

    constructor(jwtS: JwtService, gC: ConfigService) {
        this.jwtService = jwtS;
        this.globalConstants = gC;
    } 

    public async generaAccessToken(user_info: any): Promise<string> { 
        try {
            return await this.jwtService.signAsync(user_info, {
                secret: this.globalConstants.get('secret_key_access_token'),
                expiresIn: this.globalConstants.get('access_token_seconds_live')
            });
        } catch (error) {
            console.log(`JWTService:generaAccessToken : ${error.message}`);
            return '';
        }
    }

    public async generaRefreshToken(user_info: any): Promise<string> { 
        try {
            return await this.jwtService.signAsync(user_info, {
                secret: this.globalConstants.get('secret_key_refresh_token'),
                expiresIn: this.globalConstants.get('refresh_token_seconds_live')
            });
        } catch (error) {
            console.log(`JWTService:generaRefreshToken : ${error.message}`);
            return '';
        }
    } 


    async decodeAccessToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(
                token,
                { secret: this.globalConstants.get('secret_key_access_token') }
            );
        } catch(error: any) {
            console.log(`JWTService:decodeAccessToken : ${error.message}`);
            return null;
        }
    }

    async decodeRefreshToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(
                token,
                { secret: this.globalConstants.get('secret_key_refresh_token') }
            );
        } catch(error: any) {
            console.log(`JWTService:decodeRefreshToken : ${error.message}`);
            return null;
        }
    }

    async isValidAccessToken(token: string): Promise<boolean> {
        try {
            if ( [null, undefined].includes(await this.decodeAccessToken(token)) ) return false;
            return true;
        } catch(error: any) {
            console.log(`JWTService:isValidAccessToken : ${error.message}`);
            return false;
        }
    }

    async isValidRefreshToken(token: string): Promise<boolean> {
        try {
            if ( [null, undefined].includes(await this.decodeRefreshToken(token)) ) return false;
            return true;
        } catch(error: any) {
            console.log(`JWTService:isValidRefreshToken : ${error.message}`);
            return false;
        }
    }
}