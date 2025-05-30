
export interface OwnDeviceSettingINF {
    is_save_state: boolean;
    is_reset_confirm: boolean;
}

export interface OwnDeviceINF {
    id: string;
    topic_send: string;
    topic_receive: string;
    name: string;
    description: string;
    state: boolean;
    online: boolean;
    setting: OwnDeviceSettingINF;
}

export interface RoomWithRelationINF {
    id: string;
    name: string;
    description: string;
    own_devices: OwnDeviceINF[];
}

export interface HouseWallpaperINF {
    path: string;
    is_blur: boolean;
}

export interface HouseWithRelationINF {
    id: string;
    name: string;
    description: string;
    index_show: number;
    is_main_house: boolean;
    house_wallpaper: HouseWallpaperINF;
    own_devices: OwnDeviceINF[];
    rooms: RoomWithRelationINF[];
}

