
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'; // Import StackNavigator
import Setting from './setting';

const Stack = createStackNavigator(); // Tạo Stack Navigator

export default function HouseLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="housesetting" component={Setting} options={{ title: 'Nhà Của Tôi', headerShown: false }} />
        </Stack.Navigator>
    );
}
