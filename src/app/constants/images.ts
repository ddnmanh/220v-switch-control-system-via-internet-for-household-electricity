
import { ImageSourcePropType } from 'react-native';

// import WallpaperDefault from '../assets/images/default-wallpaper.png';
// import WallpaperDefault from '../assets/images/weather-wallpaper.jpg';
import WallpaperDefault from '../assets/images/sunset-with-sea-wallpaper.png';

import UserNoAvartar from '../assets/images/user-no-avatar.jpg';

import deviceSwitchButton from '../assets/images/device/switch/button.png';

const imagesGlobal: Record<string, ImageSourcePropType> = {
    WallpaperDefault,
    UserNoAvartar,
    deviceSwitchButton
}

export default imagesGlobal;
