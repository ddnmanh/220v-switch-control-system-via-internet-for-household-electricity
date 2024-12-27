import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UserEntity from './User.entity';

@Entity('refresh_tokens')
export default class RefreshTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id!: number; 

    @Column({ name: 'token', type: 'varchar', length: 2500, nullable: false })
    public token!: string;  

    @Column({ name: 'is_delete', type: 'boolean', default: false })
    public isDelete!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;  

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (auth) => auth.refreshTokens)
    @JoinColumn({ name: 'id_user' })
    public user!: UserEntity;
}