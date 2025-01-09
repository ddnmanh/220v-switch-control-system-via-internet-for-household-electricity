
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
            }}
        >
            {children}
        </HouseContext.Provider>
    );
};

export default HouseContextProvider;
