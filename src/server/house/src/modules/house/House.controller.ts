import { Body, Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HouseService } from "./House.service";

@Controller()
export class DeviceController {

    private readonly houseService: HouseService;
    private readonly configService: ConfigService;

    constructor(aS: HouseService, cS: ConfigService) {
        this.houseService = aS;
        this.configService = cS;
    }

}
