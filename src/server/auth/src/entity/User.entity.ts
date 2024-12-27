import { Exclude } from 'class-transformer';
import { Length } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import RefreshTokenEntity from './RefreshToken.entity';


export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

@Entity('users')
export default class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ name: 'username', type: 'varchar', length: 50, nullable: false, unique: true })
    public username!: string;
 
    @Column({ name: 'password', type: 'varchar', length: 250, nullable: false })
    public password!: string;

    @Column({ name: 'email', type: 'varchar', length: 50, nullable: false, unique: true })
    public email!: string;

    @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.USER })
    public role!: string;

    @Column({ name: 'is_delete', type: 'boolean', default: false })
    public isDelete!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @OneToMany(() => RefreshTokenEntity, (token) => token.id)
    public refreshTokens!: RefreshTokenEntity[]; 
}
