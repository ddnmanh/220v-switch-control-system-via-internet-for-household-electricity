import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserRegiterEntity from 'src/entity/UserRegister.entity';

@Injectable()
export class UserRegisterRepository {

    constructor(
        @InjectRepository(UserRegiterEntity)
        private readonly userRegisterRepository: Repository<UserRegiterEntity>,
    ) {}

    async createOne(firstname: string, lastname: string, username: string, password: string, email: string): Promise<UserRegiterEntity> {
        let user = new UserRegiterEntity();
        user.firstname = firstname;
        user.lastname = lastname;
        user.username = username;
        user.password = password;
        user.email = email;

        console.log(user);

        return this.userRegisterRepository.save(user);
    }

    async deleteUserRegister(userRegister: UserRegiterEntity): Promise<void> {
        await this.userRegisterRepository.remove(userRegister);
      }

    async findByIdByEmail(id: number, email: string): Promise<UserRegiterEntity | null> {
        return this.userRegisterRepository.findOne({ where: { id: id, email: email, isExpired: false } });
    }

    async findUserWithOtpByEmail(email: string): Promise<UserRegiterEntity | null> {
        return this.userRegisterRepository.findOne({
            where: { email },
            relations: ['otpRelation'], // Liên kết với OTP (OneToMany)
        });
    }

    async countUserByUsername(username: string): Promise<number> {
        return await this.userRegisterRepository.count({ where: { username: username, isExpired: false } });
    }

    async countUserByEmail(email: string): Promise<number> {
        return await this.userRegisterRepository.count({ where: { email: email, isExpired: false } });
    }

    async countUserByIdByEmail(id: number, email: string): Promise<number> {
        return await this.userRegisterRepository.count({ where: { id: id, email: email, isExpired: false } });
    }
}
