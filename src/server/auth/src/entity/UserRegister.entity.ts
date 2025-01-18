import { Exclude } from 'class-transformer';
import { Length } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import OTPEntity from './OTP.entity';


@Entity('user_register')
export default class UserRegiterEntity extends BaseEntity {

    @PrimaryGeneratedColumn() // Định nghĩa id là cột tự động tăng
    public id!: number;

    @Column({ name: 'lastname', type: 'varchar', length: 10, nullable: true })
    public lastname: string;

    @Column({ name: 'firstname', type: 'varchar', length: 20, nullable: true })
    public firstname: string;

    @Column({ name: 'username', type: 'varchar', length: 25, nullable: false, unique: true })
    public username!: string;

    @Column({ name: 'password', type: 'varchar', length: 500, nullable: false })
    public password!: string;

    @Column({ name: 'email', type: 'varchar', length: 254, nullable: false, unique: true })
    public email!: string;

    @Column({ name: 'is_expired', type: 'boolean', default: false })
    public isExpired!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt: Date;

    @OneToMany(() => OTPEntity, (otp) => otp.userRegister)
    public otpRelation!: OTPEntity[];
}
