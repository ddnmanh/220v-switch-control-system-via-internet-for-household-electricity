import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import iconsGlobal from '@/constants/icons';

interface TabIconProps {
    label?: string;
    iconName: string;
    src: any;
    size?: number;
    color: string;
    focused: boolean;
}

const TabIconCPN: React.FC<TabIconProps> = ({ label, iconName = 'default', src, size = 20, color, focused }) => {
    return (
        <View style={styles.container}>
            <Image
                source={src || (iconName ? iconsGlobal[iconName] : iconsGlobal['default'])}
                resizeMode="contain"
                tintColor={color}
                style={{ width: size, height: size }}
            />
            {
                label
                &&
                <Text
                    style={{ color: color, fontWeight: `${focused ? "semibold" : "regular"}` }}
                >
                    {label}
                </Text>
            }
        </View>
    );
}

export default TabIconCPN;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
    }
})
