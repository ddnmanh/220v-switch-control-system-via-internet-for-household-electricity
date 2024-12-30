import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UserRegiterEntity from './UserRegister.entity';

@Entity('otp')
export default class OTPEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id!: number;

    @Column({ name: 'otp', type: 'varchar', length: 6, nullable: false })
    public otp!: string;

    @Column({ name: 'is_expired', type: 'boolean', default: false })
    public isExpired!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt: Date;

    @ManyToOne(() => UserRegiterEntity, (record) => record.id, { onDelete: 'CASCADE' }) // CASCADE: Xóa user register thì xóa luôn OTP
    @JoinColumn({ name: 'id_user_register' })
    public userRegister!: UserRegiterEntity;
}
