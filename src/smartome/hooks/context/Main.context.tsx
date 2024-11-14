import React, { ReactNode } from 'react';
import LoadStaticInitContextProvider from './LoadStaticInit.context';
import DynamicValuesContextProvider from './DynamicValues.context';
import AuthContextProvider from './Auth.context';
import HouseContextProvider from './HouseData.context';
import { StatusBar } from 'react-native';

interface MainContextProps {
    children: ReactNode;
}

const MainContext: React.FC<MainContextProps> = ({ children }) => {
    return (
        <DynamicValuesContextProvider>
            <LoadStaticInitContextProvider>
                <AuthContextProvider>
                    <HouseContextProvider>
                        <StatusBar backgroundColor="rgba(0, 0, 0, 0)" translucent={true} />
                        {children}
                    </HouseContextProvider>
                </AuthContextProvider>
            </LoadStaticInitContextProvider>
        </DynamicValuesContextProvider>
    );
};

export default MainContext;
