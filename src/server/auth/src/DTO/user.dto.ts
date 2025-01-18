
import { IsEmail, IsNumber, IsString, Max, MinLength } from "class-validator";

export class RegisterUserDto {

    @IsString()
    @MinLength(0, { message: '' })
    public firstname: string;

    @IsString()
    @MinLength(0, { message: '' })
    public lastname: string;

    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    public username: string;

    @IsString()
    @MinLength(8, { message: 'Username must be at least 8 characters long' })
    public password: string;

    @IsEmail()
    public email: string;
}

export class ResendOTPVerifyRegisterAccountReq {
    @IsNumber()
    public idRegister: number;

    @IsEmail()
    public email: string;
}

export class OTPVerifyRegisterAccountReq {
    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(6, { message: 'otp must be at 6 characters' })
    @Max(6, { message: 'otp must be at 6 characters' })
    public otp: string;
}

export class UserResDTO {
    public id: string;
    public username: string;
    public email: string;
    public role: string;
}

