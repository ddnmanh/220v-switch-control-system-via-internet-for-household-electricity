import MainContext from '@/hooks/context/Main.context';
import { createStackNavigator } from '@react-navigation/stack';
import MainLayout from './(main)/_layout';
import NotFound from './+not-found';
import HouseLayout from './(house)/_layout';

const Stack = createStackNavigator();

export default function RootLayout() {
    return (
        <MainContext>
            <Stack.Navigator>
                <Stack.Screen name="(main)" component={MainLayout} options={{ title: '', headerShown: false }} />
                <Stack.Screen name="(house)" component={HouseLayout} options={{ title: 'Nhà', headerShown: false }} />
                <Stack.Screen name="+not-found" component={NotFound} options={{ title: 'Oops!' }} />
            </Stack.Navigator>
        </MainContext>
    );
}
