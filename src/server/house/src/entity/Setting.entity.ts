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
import HouseEntity from './House.entity';

@Entity('settings')
export default class SettingEntity extends BaseEntity {
    @PrimaryColumn({ name: 'id_house', type: 'varchar', length: 6 })
    public idHouse!: string;

    @Column({ name: 'ap_ssid', type: 'varchar', length: 30 })
    public apSSID!: string;

    @Column({ name: 'ap_password', type: 'varchar', length: 30 })
    public apPassword!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt!: Date;

    @OneToOne(() => HouseEntity, (house) => house.setting, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_house' })
    public house!: HouseEntity;
}
