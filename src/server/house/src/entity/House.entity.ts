import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import SettingEntity from './Setting.entity';
import AreaEntity from './Area.entity';
import OwnDeviceEntity from './OwnDevice.entity';

@Entity('houses')
export default class HouseEntity extends BaseEntity {
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

    @Column({ name: 'id_user', type: 'varchar', length: 6 })
    public idUser!: string;

    @OneToOne(() => SettingEntity, (setting) => setting.house, { cascade: true })
    public setting!: SettingEntity;

    @OneToMany(() => AreaEntity, (area) => area.house)
    public areas!: AreaEntity[];

    @OneToMany(() => OwnDeviceEntity, (device) => device.house)
    public devices!: OwnDeviceEntity[];
}
