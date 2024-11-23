
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIconCPN from '@/components/TabIcon';
import Account from './account';
import Auto from './auto';
import variablesGlobal from '@/constants/variables';
import { DynamicValuesContext } from '@/hooks/context/DynamicValues.context';
import { HouseContext } from '@/hooks/context/HouseData.context';
import { ImageBackground } from 'react-native';

import MainHomeLayout from './(home)/_layout';


const Tab = createBottomTabNavigator();

export default function MainLayout() {

    const { dimensionsSize } = React.useContext(DynamicValuesContext) || { dimensionsSize: { width: 0, height: 0 } };
    const { houseDataChosen } = React.useContext(HouseContext) || { houseDataChosen: null };

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
                    return <TabIconCPN label='' iconName={iconName} src={null} size={size} color={color} focused={focused} />;
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
                tabBarActiveTintColor: "#FFF",
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
                tabBarBackground: () => (
                    <ImageBackground
                        source={{ uri: houseDataChosen?.image_bg }}
                        resizeMode='cover'
                        blurRadius={30}
                        style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            backgroundColor: 'rgba(0, 0, 0, 1)',
                        }}
                        imageStyle={{
                            width: '100%',
                            height: dimensionsSize?.height,
                            transform: [
                                { translateY: -((dimensionsSize?.height || 0)- variablesGlobal?.heigthTabBar) },
                            ]
                        }}
                    ></ImageBackground>
                )
            })}
        >
            <Tab.Screen name="(home)" component={MainHomeLayout} options={{ title: 'Trang chủ', headerShown: false }} />
            <Tab.Screen name="auto" component={Auto} options={{ title: 'Auto', headerShown: false }} />
            <Tab.Screen name="account" component={Account} options={{ title: 'Account', headerShown: false }} />
        </Tab.Navigator>
    );
}
