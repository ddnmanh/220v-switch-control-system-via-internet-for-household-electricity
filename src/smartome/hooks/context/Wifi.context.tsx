// contexts/WifiContext.tsx
import React, { createContext, useEffect, useRef, useState, ReactNode } from "react";
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// Định nghĩa kiểu cho ngữ cảnh Wifi
interface WifiContextType {
    isWifiConnected: boolean;
    wifiInfomation: any;
}

// Tạo ngữ cảnh với giá trị mặc định là `undefined`
export const WifiContext = createContext<WifiContextType | undefined>(undefined);

// Props cho WifiContextProvider
interface WifiContextProviderProps {
    children: ReactNode;
}


export const WifiContextProvider: React.FC<WifiContextProviderProps> = ({ children }) => {

    const [isWifiConnected, setIsWifiConnected] = useState<boolean>(false);
    const [wifiInfomation, setWifiInfomation] = useState<any | null>(null);


    const isConnectedRef = useRef(false); // Dùng ref để theo dõi trạng thái kết nối Wifi tránh render lại nhiều lần

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(listendWifi);

        return () => {
            unsubscribe();
        };
    }, []);

    const listendWifi = (state: NetInfoState) => {

        console.log('Run listen wifi');

        if (state.type === 'wifi' && state.isConnected && !isConnectedRef.current) {
            setIsWifiConnected(true);
            setWifiInfomation(state);
            isConnectedRef.current = true; // Cập nhật trạng thái đã kết nối
        } else if (!state.isConnected && isConnectedRef.current) {
            setIsWifiConnected(false);
            setWifiInfomation(null);
            isConnectedRef.current = false; // Cập nhật trạng thái đã ngắt kết nối
        }
    }

    return (
        <WifiContext.Provider
            value={{
                isWifiConnected,
                wifiInfomation
            }}
        >
            {children}
        </WifiContext.Provider>
    );
};

