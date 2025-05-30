
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import AuthenFetch from '@/fetch/Authen.fetch';

// Định nghĩa interface cho User
interface UserInfo {
    id: string;
    name: string;
    email: string;
    phone: string;
}

// Định nghĩa interface cho Context
export interface AuthContextProps {
    userInfo: UserInfo | null;
    saveToken: (key: string, token: string) => Promise<void>;
    setTimeLiveAccessToken: (time: number) => void;
    handleLogOut: () => void;
}

// Định nghĩa interface cho Provider Props
interface AuthContextProviderProps {
    children: ReactNode;
}

// Constants
const ACCESS_TOKEN_KEY = process.env.EXPO_PUBLIC_TOKEN_ACCESS_NAME || 'access_token';
const REFRESH_TOKEN_KEY = process.env.EXPO_PUBLIC_TOKEN_REFRESH_NAME || 'refresh_token';
const TOKEN_RENEWAL_BUFFER = Number(process.env.EXPO_PUBLIC_GRACE_PERIOD_BEFORE_TOKEN_EXPIRES) || 30 * 1000; // 30 seconds before expiration

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const navigation = useNavigation();

    const intervalRef = React.useRef<number | null>(null);

    // State
    const [timeLiveAccessToken, setTimeLiveAccessToken] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    // Token management functions
    const saveToken = async (key: string, token: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(key, token);
        } catch (error) {
            console.log('Error saving token:', error);
        }
    };

    const getToken = async (key: string): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.log('Error getting token:', error);
            return null;
        }
    };

    // Navigation helper
    const navigateToLogin = () => {
        console.log('Navigating to login screen...');
        // Đặt lại stack và chuyển hướng đến màn hình mới
        // Xoá lịch sử chuyển hướng
        navigation.reset({
            index: 0,
            routes: [ { name: "(auth)" as never, params: { screen: "logInScreen"} } ]
        });
    };

    // API calls
    const handleGetUserInfo = async (): Promise<void> => {
        console.log('Getting user info...');

        try {
            const response = await AuthenFetch.getUserInfo();
            console.log('User info:', response);

            setUserInfo(response.data);
        } catch (error) {
            console.log('Error getting user info:', error);
            navigateToLogin();
        }
    };

    const handleRenewAccessToken = async (): Promise<void> => {
        console.log('Renewing access token...');

        const refreshToken = await getToken(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
            navigateToLogin();
            return;
        }

        try {
            const response = await AuthenFetch.renewAccessToken();

            await saveToken(ACCESS_TOKEN_KEY, response?.data?.access_token?.token ? response.data.access_token.token : '');

            if (timeLiveAccessToken !== response.data.access_token.life_time*1000) {
                setTimeLiveAccessToken(response.data.access_token.life_time*1000);
                // setTimeLiveAccessToken(20000);
            }
        } catch (error) {
            console.log('Error renewing access token:', error);
            navigateToLogin();
        }
    };

    // Initial authentication check
    useEffect(() => {
        const checkAuthentication = async () => {
            console.log('Checking authentication...');
            await handleRenewAccessToken();
            // console.log('ACCESS TOKEN: ' + await getToken(ACCESS_TOKEN_KEY));
            // console.log('REFRESH TOKEN: ' + await getToken(REFRESH_TOKEN_KEY));
        };

        checkAuthentication();

    }, []);

    // Token renewal timer
    useEffect(() => {

        if (intervalRef.current && timeLiveAccessToken <=0) clearInterval(intervalRef.current);

        if (timeLiveAccessToken <= 0) return;


        console.log('Setting up token renewal timer:', timeLiveAccessToken);

        const renewalTime = timeLiveAccessToken - TOKEN_RENEWAL_BUFFER;
        intervalRef.current = window.setInterval(handleRenewAccessToken, renewalTime);

        // Get user info after setting up timer
        handleGetUserInfo();

        return () => clearInterval(intervalRef.current || 0);
    }, [timeLiveAccessToken]);

    // Debug logs
    useEffect(() => {
        console.log('Auth Context State:', {
            timeLiveAccessToken,
            userInfo,
        });
    }, [timeLiveAccessToken, userInfo]);

    const handleLogOut = async () => {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        await AuthenFetch.logOut({ refresh_token: refreshToken });
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        setTimeLiveAccessToken(0);
        setUserInfo(null);
        navigateToLogin();
    }

    const contextValue: AuthContextProps = {
        userInfo,
        saveToken,
        setTimeLiveAccessToken,
        handleLogOut,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
