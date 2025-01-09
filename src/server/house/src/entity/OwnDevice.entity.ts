import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import SettingEntity from './Setting.entity';
import HouseEntity from './House.entity';
import AreaEntity from './Area.entity';

@Entity('own_devices')
export default class OwnDeviceEntity extends BaseEntity {
    @PrimaryGeneratedColumn() // Định nghĩa id là cột tự động tăng
    public id!: number;

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

    @Column( { name: 'id_device', type: 'varchar', length: 6, nullable: false } )
    public idDevice!: string;

    @ManyToOne(() => HouseEntity, (record) => record.id)
    @JoinColumn({ name: 'id_house' })
    public house!: HouseEntity;

    @ManyToOne(() => AreaEntity, (record) => record.id, { nullable: true })
    @JoinColumn({ name: 'id_area'})
    public area!: AreaEntity | null;
}
