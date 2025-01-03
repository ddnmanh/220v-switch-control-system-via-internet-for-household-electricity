import { Exclude } from 'class-transformer';
import { Length } from 'class-validator';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import LogInHistoryEntity from './LogInHistory.entity';
import PasswordHistoryEntity from './PasswordHistory.entity';
import { GenerateUUIDService } from 'src/modules/common/generate-uuid/GenerateUUID.service';


export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    USER = 'USER'
}

@Entity('users')
export default class UserEntity extends BaseEntity {

    @PrimaryColumn({ type: 'varchar', length: 6, unique: true, nullable: false }) // Định nghĩa khóa chính 6 ký tự
    public id!: string;

    @Column({ name: 'lastname', type: 'varchar', length: 20, nullable: true })
    public lastname: string;

    @Column({ name: 'firstname', type: 'varchar', length: 10, nullable: true })
    public firstname: string;

    @Column({ name: 'username', type: 'varchar', length: 25, nullable: false, unique: true })
    public username!: string;

    @Column({ name: 'email', type: 'varchar', length: 254, nullable: false, unique: true })
    public email!: string;

    @Column({ name: 'avatar_path', type: 'varchar', length: 2500, nullable: true })
    public avatarPath!: string;

    @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.USER })
    public role!: string;

    @Column({ name: 'is_delete', type: 'boolean', default: false })
    public isDelete!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt: Date;

    @OneToMany(() => LogInHistoryEntity, (record) => record.id)
    public UserLoginHistory!: LogInHistoryEntity[];

    @OneToMany(() => PasswordHistoryEntity, (record) => record.user)
    public userPassword!: PasswordHistoryEntity[];
}
