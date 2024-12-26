
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddDevice from './AddDevice';

const Stack = createStackNavigator();

export default function DeviceLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="addDevice" component={AddDevice} options={{ title: 'Thêm Thiết Bị', headerShown: false }} />
        </Stack.Navigator>
    );
}
