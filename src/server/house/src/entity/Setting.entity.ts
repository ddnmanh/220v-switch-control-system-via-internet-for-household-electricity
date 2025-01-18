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

    @Column({ name: 'index_show', type: 'int', default: -1})
    public indexShow: number;

    @Column({ name: 'wallpaper_path', type: 'varchar', length: 3000, nullable: false, default: '' })
    public wallpaperPath!: string;

    @Column({ name: 'wallpaper_blur', type: 'boolean', default: false })
    public wallpaperBlur!: number;

    @Column({ name: 'is_main_house', type: 'boolean', default: false })
    public isMainHouse!: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    public createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', default: () => 'CURRENT_TIMESTAMP(6)' })
    public updatedAt!: Date;

    @OneToOne(() => HouseEntity, (house) => house.setting, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_house' })
    public house!: HouseEntity;
}

