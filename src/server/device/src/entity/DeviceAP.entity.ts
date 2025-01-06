import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import DeviceEntity from './Device.entity';

@Entity('device_ap')
export default class DeviceAPEntity extends BaseEntity {
    @PrimaryColumn({ name: 'device_id', type: 'varchar', length: 6 })
    public deviceId!: string;

    @Column({ name: 'ap_ssid', type: 'varchar', length: 30, nullable: false })
    public apSSID!: string;

    @Column({ name: 'ap_password', type: 'varchar', length: 30, nullable: false })
    public apPassword!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt!: Date;

    @OneToOne(() => DeviceEntity, (device) => device.deviceAP, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'device_id' })
    public device!: DeviceEntity;
}
