import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import DeviceAPEntity from './DeviceAP.entity';

export enum DeviceType {
    SWITCH = 'SWITCH',
}

@Entity('devices')
export default class DeviceEntity extends BaseEntity {
    @PrimaryColumn({ type: 'varchar', length: 6, unique: true, nullable: false })
    public id!: string;

    @Column({ name: 'type', type: 'enum', enum: DeviceType, default: DeviceType.SWITCH })
    public type!: DeviceType;

    @Column({ name: 'name', type: 'varchar', length: 30, nullable: true })
    public name!: string;

    @Column({ name: 'desc', type: 'varchar', length: 150, nullable: true })
    public desc!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public updatedAt!: Date;

    @OneToOne(() => DeviceAPEntity, (deviceAP) => deviceAP.device, { cascade: true })
    public deviceAP!: DeviceAPEntity;
}
