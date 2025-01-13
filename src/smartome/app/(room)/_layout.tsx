
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'; // Import StackNavigator
import RoomSettingScreen from './setting';
import CreateRoomScreen from './create';

const Stack = createStackNavigator(); // Tạo Stack Navigator

export default function RoomLayout() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.FadeFromRightAndroid, // Hiệu ứng chuyển màn hình
            }}
        >
            <Stack.Screen name="roomSettingScreen" component={RoomSettingScreen} options={{ title: 'Phòng Của Tôi', headerShown: false }} />
            <Stack.Screen name="createRoomScreen" component={CreateRoomScreen} options={{ title: 'Thêm phòng', headerShown: false }} />
        </Stack.Navigator>
    );
}
