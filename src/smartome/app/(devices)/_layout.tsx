
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddDevice from './AddDevice';
import SetupOwnDevice from './SetupOwnDevice';

const Stack = createStackNavigator();

export default function DeviceLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="addDevice" component={AddDevice} options={{ title: 'Thêm Thiết Bị', headerShown: false }} />
            <Stack.Screen name="setupOwnDevice" component={SetupOwnDevice} options={{ title: 'Thiết lập sau khi thêm thiết bị', headerShown: false }} />
        </Stack.Navigator>
    );
}
