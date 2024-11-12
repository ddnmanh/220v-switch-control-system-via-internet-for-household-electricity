
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIconCPN from '@/components/TabIcon';
import Account from './account';
import Auto from './auto';
import MainHomeLayout from './(home)/_layout';

import variablesGlobal from '@/constants/variables';

const Tab = createBottomTabNavigator();

export default function MainLayout() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'home':
                            iconName = focused ? 'homeSolid' : 'homeRegular';
                            break;
                        case 'auto':
                            iconName = focused ? 'badgeCheckSolid' : 'badgeCheckRegular';
                            break;
                        case 'account':
                            iconName = focused ? 'userSolid' : 'userRegular';
                            break;
                        default:
                            iconName = 'defaultIcon';
                            break;
                    }
                    return <TabIconCPN label=' ' iconName={iconName} src={null} size={size} color={color} focused={focused} />;
                },
                tabBarStyle: {
                    position: 'absolute',
                    height: variablesGlobal.heigthTabBar,
                    border: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#000",
                tabBarInactiveTintColor: '#ccc',
            })}
        >
            <Tab.Screen name="home" component={MainHomeLayout} options={{ title: 'Trang chủ', headerShown: false }} />
            <Tab.Screen name="auto" component={Auto} options={{ title: 'Auto', headerShown: false }} />
            <Tab.Screen name="account" component={Account} options={{ title: 'Account', headerShown: false }} />
        </Tab.Navigator>
    );
}
