import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DeviceType {
    SWITCH = 'SWITCH',
}

@Entity('history-openation')
export default class HistoryOperationEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ name: 'id_house', type: 'varchar', length: 6, nullable: false })
    public idHouse!: string;

    @Column({ name: 'id_device', type: 'varchar', length: 6, nullable: false })
    public idDevice!: string;

    @Column({ name: 'state', type: 'tinyint', nullable: true })
    public state!: boolean;

    @Column({ name: 'event_date_time', type: 'datetime', nullable: false })
    eventDateTime: Date; // Sử dụng kiểu `Date` của JavaScript
}
