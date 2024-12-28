import React, { ReactNode } from 'react';
import LoadStaticInitContextProvider from './LoadStaticInit.context';
import DynamicValuesContextProvider from './DynamicValues.context';
import AuthContextProvider from './Auth.context';
import HouseContextProvider from './HouseData.context';
import { StatusBar } from 'react-native';
import { MQTTContextProvider } from './MQTT.context';
import { WifiContextProvider } from './Wifi.context';
import { GPSContextProvider } from './GPS.context';

interface MainContextProps {
    children: ReactNode;
}

const MainContext: React.FC<MainContextProps> = ({ children }) => {
    return (
        <WifiContextProvider>
            <DynamicValuesContextProvider>
                <LoadStaticInitContextProvider>
                    <AuthContextProvider>
                        <GPSContextProvider>
                            <MQTTContextProvider>
                                <HouseContextProvider>
                                    <StatusBar backgroundColor="rgba(0, 0, 0, 0)" translucent={true} />
                                    {children}
                                </HouseContextProvider>
                            </MQTTContextProvider>
                        </GPSContextProvider>
                    </AuthContextProvider>
                </LoadStaticInitContextProvider>
            </DynamicValuesContextProvider>
        </WifiContextProvider>
    );
};

export default MainContext;
