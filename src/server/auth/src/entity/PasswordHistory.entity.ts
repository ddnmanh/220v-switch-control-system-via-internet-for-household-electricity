import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UserEntity from './User.entity';

@Entity('password_history')
export default class PasswordHistoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id!: number;

    @Column({ name: 'password', type: 'varchar', length: 500, nullable: false })
    public password!: string;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    public isActive!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt: Date;

    @ManyToOne(() => UserEntity, (record) => record.id)
    @JoinColumn({ name: 'id_user' })
    public user!: UserEntity;
}
