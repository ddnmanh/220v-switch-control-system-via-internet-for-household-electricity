
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AddDevice from './AddDevice';
import SetupOwnDevice from './Device';
import Device from './Device';

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
            <Stack.Screen name="setupOwnDevice" component={SetupOwnDevice} options={{ title: 'Thiết lập sau khi thêm thiết bị', headerShown: false }} />
            <Stack.Screen name="device" component={Device} options={{ title: 'Điều khiển thiết bị', headerShown: false }} />
        </Stack.Navigator>
    );
}
