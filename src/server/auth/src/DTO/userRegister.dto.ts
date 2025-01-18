
import { IsEmail, IsNumber, IsString, Max, MinLength } from "class-validator";

export class UserRegisterResDTO {
    public id: number;
    public firstname: string;
    public lastname: string;
    public username: string;
    public email: string;
    public role: string;
}

