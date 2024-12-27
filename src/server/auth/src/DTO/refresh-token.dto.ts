
import { IsDate, IsDateString, IsNumber, IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
    @IsNumber()
    public id: number;

    @IsNumber()
    public idUser: number;

    @IsString()
    public token: string;

    @IsDate()
    public createdAt: Date;

    @IsDate()
    public updatedAt: Date;
} 