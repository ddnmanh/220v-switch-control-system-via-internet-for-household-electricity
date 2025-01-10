
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import HouseFetch from '@/fetch/House.fetch';
import { ResponseDTO } from '@/interfaces/API.interface';
import { AuthContext, AuthContextProps } from './Auth.context';

export interface HouseContextProps {
    housesData: any;
    houseDataChosen: any;
    areaDataChosen: any;
    setHousesData: React.Dispatch<React.SetStateAction<any>>;
    handleChoosenHouseByID: (id_house: number) => void;
    handleChooseAreaByID: (id_area: number) => void;
    reloadHouseContext: () => void;
    handleUpdateDataSwitchDevice: (id_device: string, state: boolean, is_online: boolean, name: string) => void;
}

export const HouseContext = createContext<HouseContextProps | undefined>(undefined);

interface HouseContextProviderProps {
    children: ReactNode;
}

const HouseContextProvider: React.FC<HouseContextProviderProps> = ({ children }) => {
    const { userInfo } = React.useContext(AuthContext) as AuthContextProps;

    const [housesData, setHousesData] = useState<any>([]);
    const [houseDataChosen, setHouseDataChosen] = useState<any>({});
    const [areaDataChosen, setAreaDataChosen] = useState<any>({});

    const handleGetHouseWithAllRelations = useCallback(async () => {
        try {
            const response: ResponseDTO = await HouseFetch.getInfo("");
            if (response.code === 200) {
                const data = response.data || [];
                setHousesData(data);

                // Chọn nhà chính hoặc nhà đầu tiên
                const mainHouse = data.find((house: any) => house.setting?.is_main_house) || data[0];
                if (mainHouse) setHouseDataChosen(mainHouse);
            }
        } catch (error) {
            console.log("Error fetching house data:", error);
        }
    }, []);

    const reloadHouseContext = useCallback(() => {
        handleGetHouseWithAllRelations();
    }, [handleGetHouseWithAllRelations]);

    useEffect(() => {
        if (userInfo) {
            handleGetHouseWithAllRelations();
        }
    }, [userInfo, handleGetHouseWithAllRelations]);

    const handleChoosenHouseByID = (house_id: number) => {
        const chosenHouse = housesData.find((house: any) => house.id === house_id);
        if (chosenHouse) {
            setHouseDataChosen(chosenHouse);
            setAreaDataChosen({});
        }
    };

    const handleChooseAreaByID = (id_area: number) => {
        const chosenArea = id_area
            ? houseDataChosen.areas?.find((area: any) => area.id === id_area)
            : {};
        setAreaDataChosen(chosenArea || {});
    };

    const handleUpdateDataSwitchDevice = (id_device: string, state: boolean, is_online: boolean, name: string) => {
        const newAreas = houseDataChosen.areas.map((area: any) => {
            const newDevices = area.own_devices.map((device: any) => {
                if (device.id_device === id_device) {
                    return { ...device, state, online: is_online, name };
                }
                return device;
            });
            return { ...area, own_devices: newDevices };
        });

        setHouseDataChosen({ ...houseDataChosen, areas: [...newAreas] });

        // Cập nhật lại state cho areaDataChosen
        if (areaDataChosen.id) {
            const newArea = { ...areaDataChosen };
            newArea.own_devices = newArea.own_devices.map((device: any) => {
                if (device.id_device === id_device) {
                    return { ...device, state, online: is_online, name };
                }
                return device;
            });
            setAreaDataChosen(newArea);
        }
    }

    return (
        <HouseContext.Provider
            value={{
                housesData,
                houseDataChosen,
                areaDataChosen,
                setHousesData,
                handleChoosenHouseByID,
                handleChooseAreaByID,
                reloadHouseContext,
                handleUpdateDataSwitchDevice
            }}
        >
            {children}
        </HouseContext.Provider>
    );
};

export default HouseContextProvider;
