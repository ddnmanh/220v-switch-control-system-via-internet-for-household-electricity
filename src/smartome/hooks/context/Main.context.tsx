import React, { ReactNode } from 'react';
import LoadStaticInitContextProvider from './LoadStaticInit.context';

interface MainContextProps {
    children: ReactNode;
}

const MainContext: React.FC<MainContextProps> = ({ children }) => {
    return (
        <LoadStaticInitContextProvider>
            {children}
        </LoadStaticInitContextProvider>
    );
};

export default MainContext;
