import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UserEntity from './User.entity';

@Entity('login_history')
export default class LogInHistoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id!: number;

    @Column({ name: 'token', type: 'varchar', length: 2500, nullable: false })
    public token!: string;

    @Column({ name: 'latitude', type: 'float', default: 0 })
    public latitude!: boolean;

    @Column({ name: 'longitude', type: 'float', default: 0 })
    public longitude!: boolean;

    @Column({ name: 'is_expired', type: 'boolean', default: false })
    public isExpired!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt: Date;

    @ManyToOne(() => UserEntity, (record) => record.id)
    @JoinColumn({ name: 'id_user' })
    public user!: UserEntity;
}
