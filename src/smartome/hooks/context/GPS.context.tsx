// contexts/GPSContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import * as Location from 'expo-location';

interface GPSContextType {
    GPSInfomation: any;
}

export const GPSContext = createContext<GPSContextType | undefined>(undefined);

interface GPSContextProviderProps {
    children: ReactNode;
}

export const GPSContextProvider: React.FC<GPSContextProviderProps> = ({ children }) => {

    const [GPSInfomation, setGPSInfomation] = useState<any>(null);

    React.useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            setGPSInfomation(location);
        })();
    }, []);

    return (
        <GPSContext.Provider
            value={{
                GPSInfomation
            }}
        >
            {children}
        </GPSContext.Provider>
    );
};

