import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import SettingEntity from './Setting.entity';
import HouseEntity from './House.entity';
import OwnDeviceEntity from './OwnDevice.entity';

@Entity('rooms')
export default class RoomEntity extends BaseEntity {
    @PrimaryColumn({ type: 'varchar', length: 6, unique: true })
    public id!: string;

    @Column({ name: 'name', type: 'varchar', length: 25, nullable: true })
    public name!: string;

    @Column({ name: 'desc', type: 'varchar', length: 150, nullable: true })
    public desc!: string;

    @Column({ name: 'is_delete', type: 'boolean', default: false })
    public isDelete!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt!: Date;

    @ManyToOne(() => HouseEntity, (house) => house.rooms)
    @JoinColumn({ name: 'id_house' })
    public house!: HouseEntity;

    @OneToMany(() => OwnDeviceEntity, (device) => device.room)
    public ownDevices!: OwnDeviceEntity[];
}
