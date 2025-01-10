
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AddDevice from './AddDevice';
import Device from './Device';
import SettingDevice from './SettingDevice';
import LogDevice from './LogDevice';
import SetupNewOwnDevice from './SetupNewOwnDevice';

const Stack = createStackNavigator();

export default function DeviceLayout() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.FadeFromRightAndroid, // Hiệu ứng chuyển màn hình
            }}
        >
            <Stack.Screen name="addDevice" component={AddDevice} options={{ title: 'Thêm Thiết Bị', headerShown: false }} />
            <Stack.Screen name="setupNewOwnDeviceScreen" component={SetupNewOwnDevice} options={{ title: 'Thiết lập sau khi thêm thiết bị', headerShown: false }} />
            <Stack.Screen name="deviceScreen" component={Device} options={{ title: 'Điều khiển thiết bị', headerShown: false }} />
            <Stack.Screen name="settingDeviceScreen" component={SettingDevice} options={{ title: 'Cài đặt thiết bị', headerShown: false }} />
            <Stack.Screen name="logDeviceScreen" component={LogDevice} options={{ title: 'Lịch sử hoạt động của thiết bị', headerShown: false }} />
        </Stack.Navigator>
    );
}
