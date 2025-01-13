

export interface OwnDeviceINF {
    id: string;
    id_device: string;
    mqtt_topic_send: string;
    mqtt_topic_receive: string;
    name: string;
    desc: string;
    state: boolean;
    online: boolean;
}

export interface RoomWithRelationINF {
    id: string;
    name: string;
    desc: string;
    own_devices: OwnDeviceINF[];
}

export interface HouseSettingINF {
    id_house: string;
    index_show: number;
    wallpaper_path: string;
    wallpaper_blur: boolean;
    is_main_house: boolean;
}

export interface HouseWithRelationINF {
    id: string;
    id_user: string;
    name: string;
    desc: string;
    own_devices: OwnDeviceINF[];
    rooms: RoomWithRelationINF[];
    setting: HouseSettingINF;
}

export interface HouseWithRelationINF {
    id: string;
    id_user: string;
    name: string;
    desc: string;
    setting: HouseSettingINF;
}


