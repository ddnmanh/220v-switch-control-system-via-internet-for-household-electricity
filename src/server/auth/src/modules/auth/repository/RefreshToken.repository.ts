import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import RefreshTokenEntity from 'src/entity/RefreshToken.entity';
import UserEntity from 'src/entity/User.entity';
import { Repository } from 'typeorm'; 

@Injectable()
export class RefreshTokenRepository {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(RefreshTokenEntity)
        private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    ) { }

    // success
    async createOne(userId: number, refreshTokenValue: string): Promise<RefreshTokenEntity> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } }); 
    
            if (!user) {
                return new RefreshTokenEntity();
            }  

            const refreshToken = new RefreshTokenEntity();
            refreshToken.user = user;
            refreshToken.token = refreshTokenValue;

            return await this.refreshTokenRepository.save<RefreshTokenEntity>(refreshToken);
            
        } catch (error) {
            return new RefreshTokenEntity();
        }
    } 

    async findByUserIdAndToken(userId: number, refreshToken: string): Promise<RefreshTokenEntity | null> {
        return this.refreshTokenRepository.findOne({
            where: {
                user: { id: userId },
                token: refreshToken,
                isDelete: false,
            },
        });
    }

    async softDeleteRefreshToken(userId: number, refreshToken: string): Promise<void> {
        await this.refreshTokenRepository.update(        
            { 
                user: { id: userId }, 
                token: refreshToken 
            }, 
            { isDelete: true }
        );
    }
}
