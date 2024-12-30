
import { IsString, MinLength } from "class-validator";

export class SignInDto {
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    public username: string;

    @IsString()
    @MinLength(8, { message: 'Username must be at least 8 characters long' })
    public password: string;
}
