

export interface OwnDeviceINF {
    id: string;
    id_device: string;
    name: string;
    desc: string;
    state: boolean;
    online: boolean;
}

export interface AreaWithRelationINF {
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
    areas: AreaWithRelationINF[];
    setting: HouseSettingINF;
}

export interface HouseWithRelationINF {
    id: string;
    id_user: string;
    name: string;
    desc: string;
    setting: HouseSettingINF;
}


