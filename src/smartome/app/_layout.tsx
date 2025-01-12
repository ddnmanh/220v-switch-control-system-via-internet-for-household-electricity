import MainContext from '@/hooks/context/Main.context';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MainLayout from './(main)/_layout';
import NotFound from './+not-found';
import HouseLayout from './(house)/_layout';
import DeviceLayout from './(devices)/_layout';
import AuthLayout from './(auth)/_layout';
import RoomLayout from './(room)/_layout';

const Stack = createStackNavigator();

export default function RootLayout() {
    return (
        <MainContext>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.FadeFromRightAndroid, // Hiệu ứng chuyển màn hình
                }}

                initialRouteName='(main)'
            >
                <Stack.Screen name="(main)" component={MainLayout} options={{ title: '', headerShown: false }} />
                <Stack.Screen name="(auth)" component={AuthLayout} options={{ title: '', headerShown: false }} />
                <Stack.Screen name="(house)" component={HouseLayout} options={{ title: 'Nhà', headerShown: false }} />
                <Stack.Screen name="(room)" component={RoomLayout} options={{ title: 'Phòng', headerShown: false }} />
                <Stack.Screen name="(devices)" component={DeviceLayout} options={{ title: 'Thiết Bị', headerShown: false }} />
                <Stack.Screen name="+not-found" component={NotFound} options={{ title: 'Oops!' }} />
            </Stack.Navigator>
        </MainContext>
    );
}
