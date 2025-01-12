import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import SettingEntity from './Setting.entity';
import OwnDeviceEntity from './OwnDevice.entity';
import RoomEntity from './Room.entity';

@Entity('houses')
export default class HouseEntity extends BaseEntity {
    @PrimaryColumn({ type: 'varchar', length: 6, unique: true })
    public id!: string;

    @Column({ name: 'name', type: 'varchar', length: 25, nullable: true, default: 'Nhà Mới' })
    public name!: string;

    @Column({ name: 'desc', type: 'varchar', length: 150, nullable: true, default: "" })
    public desc!: string;

    @Column({ name: 'is_delete', type: 'boolean', default: false })
    public isDelete!: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt!: Date;

    @Column({ name: 'id_user', type: 'varchar', length: 6, nullable: false })
    public idUser!: string;

    @OneToOne(() => SettingEntity, (setting) => setting.house, { cascade: true })
    public setting!: SettingEntity;

    @OneToMany(() => RoomEntity, (room) => room.house)
    public rooms!: RoomEntity[];

    @OneToMany(() => OwnDeviceEntity, (device) => device.house)
    public ownDevices!: OwnDeviceEntity[];
}
