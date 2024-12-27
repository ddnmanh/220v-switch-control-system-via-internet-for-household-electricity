import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import UserEntity from 'src/entity/User.entity';

@Injectable()
export class UserRepository {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}  

    async findOneByUsername(username: string = ''): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { username: username } });
    }

    async findOneByEmail(email: string = ''): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email: email } });
    }

    async createOne(username: string, password: string, email: string): Promise<UserEntity> {
        let user = new UserEntity();
        user.username = username;
        user.password = password;
        user.email = email; 
        return this.userRepository.save(user);
    }

    async countUserByUsername(username: string): Promise<number> {
        return await this.userRepository.count({ where: { username: username } });
    }

    async countUserByEmail(email: string): Promise<number> {
        return await this.userRepository.count({ where: { email: email } });
    }
}
