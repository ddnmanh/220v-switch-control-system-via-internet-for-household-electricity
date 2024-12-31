
import { IsNumber, IsString, MinLength } from "class-validator";

export class LogInDto {
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    public username: string;

    @IsString()
    @MinLength(8, { message: 'Username must be at least 8 characters long' })
    public password: string;

    @IsNumber()
    public latitude: number;

    @IsNumber()
    public longitude: number;
}
