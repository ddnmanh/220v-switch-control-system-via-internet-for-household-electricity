import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'; // Import StackNavigator
import Index from './index';
import Room from './room';

const Stack = createStackNavigator(); // Tạo Stack Navigator

export default function HomeLayout() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.FadeFromRightAndroid, // Hiệu ứng chuyển màn hình
            }}
        >
            <Stack.Screen name="indexScreen" component={Index} options={{ title: 'Nhà Của Tôi', headerShown: false }} />
            <Stack.Screen name="roomScreen" component={Room} options={{ title: 'Phòng Của Tôi', headerShown: false}} />
        </Stack.Navigator>
    );
}
