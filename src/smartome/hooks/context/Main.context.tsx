import React, { ReactNode } from 'react';
import LoadStaticInitContextProvider from './LoadStaticInit.context';
import DynamicValuesContextProvider from './DynamicValues.context';
import AuthContextProvider from './Auth.context';
import HouseContextProvider from './HouseData.context';

interface MainContextProps {
    children: ReactNode;
}

const MainContext: React.FC<MainContextProps> = ({ children }) => {
    return (
        <DynamicValuesContextProvider>
            <LoadStaticInitContextProvider>
                <AuthContextProvider>
                    <HouseContextProvider>
                        {children}
                    </HouseContextProvider>
                </AuthContextProvider>
            </LoadStaticInitContextProvider>
        </DynamicValuesContextProvider>
    );
};

export default MainContext;
