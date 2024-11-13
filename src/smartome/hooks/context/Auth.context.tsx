import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const getTokens = async () => {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Error fetching tokens: ", error);
            return { accessToken: null, refreshToken: null };
        }
    };

    const validateAccessToken = async () => {
        const { accessToken } = await getTokens();
        // Kiểm tra tính hợp lệ của access token ở đây
        return accessToken !== null; // Placeholder
    };

    const refreshAccessToken = async (refreshToken: string) => {
        // Giống như trước, nhưng đảm bảo bạn sử dụng Secure Store
        return false; // Placeholder
    };

    const checkLoginStatus = async () => {
        const { accessToken, refreshToken } = await getTokens();
        let isLoggedIn = await validateAccessToken();

        if (!isLoggedIn && refreshToken) {
            isLoggedIn = await refreshAccessToken(refreshToken);
        }

        setIsLoggedIn(isLoggedIn);
        // if (!isLoggedIn) {
        //     router.replace('(auth)/sign-in');
        // }
    };

    useEffect(() => {
        checkLoginStatus();
        console.log(process.env.EXPO_PUBLIC_DOMAIN_SERVER);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
