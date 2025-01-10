
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LogIn from './LogInScreen';
import SignUp from './SignUp';
import OTPVerify from './OTPVerify';

const Stack = createStackNavigator();

export default function AuthLayout() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.ScaleFromCenterAndroid, // Hiệu ứng chuyển màn hình
            }}
        >
            <Stack.Screen name="logInScreen" component={LogIn} options={{ title: 'Đăng Nhập', headerShown: false }} />
            <Stack.Screen name="signUpScreen" component={SignUp} options={{ title: 'Đăng Ký', headerShown: false }} />
            <Stack.Screen name="otpVerifyScreen" component={OTPVerify} options={{ title: 'Mã Xác Thực', headerShown: false }} />
        </Stack.Navigator>
    );
}
