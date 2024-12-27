import { IsBoolean, IsString } from "class-validator";

export class ErrorObj {
    public property: string;
    public message: string;
}

export class ServiceResDTO {
    @IsBoolean()
    public success: boolean; 

    @IsString()
    public status: string;

    public message: ErrorObj[];

    public data: any;
}