import { Image } from 'react-native';
import React from 'react';
import iconsGlobal from '@/constants/icons';

interface IconCPNProps {
    iconName?: string | null;
    src?: any;
    size?: any;
    rotate?: number;
    color?: string | null;
    style?: any;
}


const IconCPN: React.FC<IconCPNProps> = ({ iconName, src, size = 15, rotate = 0, color, style }) => {

    return (
        <Image
            source={src || (iconName ? iconsGlobal[iconName] : iconsGlobal['default'])}
            style={[
                {
                    width: size,
                    height: size,
                    transform: [{ rotate: `${rotate}deg` }],
                    ...(color ? { tintColor: color } : {}), // Chỉ thêm tintColor khi có giá trị color
                },
                style
            ]}
            resizeMode="contain"
        />
    );
};


export default IconCPN;
