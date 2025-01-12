
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'; // Import StackNavigator
import RoomSettingScreen from './setting';

const Stack = createStackNavigator(); // Tạo Stack Navigator

export default function RoomLayout() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.FadeFromRightAndroid, // Hiệu ứng chuyển màn hình
            }}
        >
            <Stack.Screen name="roomSettingScreen" component={RoomSettingScreen} options={{ title: 'Nhà Của Tôi', headerShown: false }} />
        </Stack.Navigator>
    );
}
