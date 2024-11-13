import variablesGlobal from '@/constants/variables';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Dimensions } from 'react-native';

export interface DimensionsSizeITF {
    width: number;
    height: number;
}

export interface DeviceItemSizeITF {
    width: number;
    height: number;
}

export interface DynamicValuesContextProps {
    dimensionsSize: DimensionsSizeITF;
    deviceItemSize: DeviceItemSizeITF;
}


export const DynamicValuesContext = createContext < DynamicValuesContextProps | undefined > (undefined);

interface DynamicValuesContextProviderProps {
    children: ReactNode;
}

const variablesInComponent = {
    textPrimary: '#fff',
    textSecondary: '#ccc',
    gapInDeviceList: 14,
    intensityDeviceItemBlur: 70,
}

export default function DynamicValuesContextProvider({ children }: DynamicValuesContextProviderProps) {
    const [dimensionsSize, setDimensionsSize] = useState<DimensionsSizeITF>({ width: 0, height: 0 });

    useEffect(() => {
        const { width, height } = Dimensions.get('window');
        setDimensionsSize({ width, height });
    }, []);

    const [deviceItemSize, setDeviceItemSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        const width = (((dimensionsSize?.width || 0) - variablesGlobal.marginScreenAppHorizontal*2) / 2) - (variablesInComponent.gapInDeviceList / 2);
        setDeviceItemSize({ width, height: width * 9 / 12 });
    }, [dimensionsSize?.width]);

    return (
        <DynamicValuesContext.Provider value={{ dimensionsSize, deviceItemSize }}>
            {children}
        </DynamicValuesContext.Provider>
    );
}
