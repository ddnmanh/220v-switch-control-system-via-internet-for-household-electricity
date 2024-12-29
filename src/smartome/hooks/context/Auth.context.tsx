import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

interface AuthContextProps {
    userInfo: any;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

const fakeUserInfo = {
    id: 'y7dt-87po',
    name: 'Nguyễn Thanh Tùng',
    email: 'nguyenthanhtungXYZ@smartome.com',
    phone: '0123456789',
};

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {

    const navigation = useNavigation();

    const [userInfo, setUserInfo] = useState(null);
    // const [userInfo, setUserInfo] = useState(fakeUserInfo || null);

    const [isGetUserInfo, setIsGetUserInfo] = useState(true);



    useEffect(() => {
        if (!userInfo) {
            navigation.navigate( "(auth)", { screen: "logInScreen" } );
        }
    }, [userInfo]);

    return (
        <AuthContext.Provider value={{ userInfo }}>
            {/* {isGetUserInfo ? <></> : <>{children}</>} */}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
