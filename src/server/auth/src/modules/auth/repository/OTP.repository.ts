import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OTPEntity from 'src/entity/OTP.entity';
import UserRegiterEntity from 'src/entity/UserRegister.entity';

@Injectable()
export class OTPRepository {

    constructor(
        @InjectRepository(OTPEntity)
        private readonly otpRepository: Repository<OTPEntity>,
    ) {}

    async saveOne(userRegister: UserRegiterEntity, otp: string): Promise<OTPEntity> {
        let otpEntity = new OTPEntity();

        otpEntity.userRegister = userRegister;
        otpEntity.otp = otp;

        return this.otpRepository.save(otpEntity);
    }

    async deleteAllByIdUserRegister(userRegister: UserRegiterEntity): Promise<number> {
        const result = await this.otpRepository.delete({ userRegister: userRegister });
        return result.affected || 0; // Trả về số lượng bản ghi đã xóa
    }

    async findOneByOTP(otp: string): Promise<OTPEntity | null> {
        return this.otpRepository.findOne({ where: { otp: otp } });
    }
}
