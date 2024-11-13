import React, { createContext, useState, useEffect, ReactNode } from 'react';
import HouseFetch from '@/fetch/House.fetch';
import { API_response } from '@/interfaces/API.interface';

interface HouseContextProps {
    housesData: any;
    houseDataChosen: any;
    areaDataChosen: any;
    handleChoosenHouseByID: (id_house: number) => void;
    handleChooseAreaByID: (id_area: number) => void;
}

export const HouseContext = createContext<HouseContextProps | undefined>(undefined);

interface HouseContextProviderProps {
    children: ReactNode;
}

const fake_house = [
    {
        id: 1,
        name: 'Nhà Chính',
        image_bg: 'http://192.168.1.4:3000/images/background-app-warm.jpg',
        areas: [
            {
                id: 1,
                name: 'Phòng khách',
                devices: [
                    {
                        id: 1,
                        name: 'Đèn trần',
                        status: true
                    },
                    {
                        id: 2,
                        name: 'Quạt trần',
                        status: true
                    },
                    {
                        id: 3,
                        name: 'Điều hòa trái',
                        status: false
                    },
                    {
                        id: 4,
                        name: 'Điều hòa phải',
                        status: false
                    }
                ]
            },
            {
                id: 2,
                name: 'Phòng ngủ',
                devices: [
                    {
                        id: 1,
                        name: 'Đèn lớn',
                        status: true
                    },
                    {
                        id: 2,
                        name: 'Đèn ngủ',
                        status: true
                    },
                    {
                        id: 3,
                        name: 'Điều hòa',
                        status: false
                    }
                ]
            },
            {
                id: 3,
                name: 'Nhà bếp',
                devices: [
                    {
                        id: 1,
                        name: 'Quạt hút khói',
                        status: true
                    },
                    {
                        id: 2,
                        name: 'Đèn lớn',
                        status: true
                    },
                    {
                        id: 3,
                        name: 'Bếp điện',
                        status: false
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Nhà Trọ',
        image_bg: 'http://192.168.1.4:3000/images/background-app-mountain.jpg',
        areas: [
            {
                id: 1,
                name: 'Không gian chính',
                devices: [
                    {
                        id: 1,
                        name: 'Đèn lớn',
                        status: true
                    },
                    {
                        id: 2,
                        name: 'Quạt để bàn',
                        status: true
                    },
                    {
                        id: 3,
                        name: 'Nguồn điện cho máy tính',
                        status: false
                    },
                    {
                        id: 4,
                        name: 'Đèn ngủ',
                        status: false
                    }
                ]
            },
            {
                id: 2,
                name: 'Phòng tắm',
                devices: [
                    {
                        id: 1,
                        name: 'Đèn tắm',
                        status: true
                    }
                ]
            }
        ]
    }
]

const HouseContextProvider: React.FC<HouseContextProviderProps> = ({ children }) => {

    const [housesData, setHousesData] = useState<any>([]);
    const [houseDataChosen, setHouseDataChosen] = useState<any>({});
    const [areaDataChosen, setAreaDataChosen] = useState<any>({});


    useEffect(() => {
        const fetchData = async () => {
            // const data = await HouseFetch.AllHouses() as API_response;
            // setHouseDataChosen(data.data);
            setHousesData(fake_house);
            setHouseDataChosen(fake_house[0]);
        };
        fetchData();
    }, []);


    const handleChoosenHouseByID = (house_id: number) => {
        const choosenHouse = housesData.find((house: any) => house.id === house_id);
        setHouseDataChosen(choosenHouse);
    }

    const handleChooseAreaByID = (id_area: number) => {
        if (id_area !== 0) {
            const chooseArea = houseDataChosen.areas.find((area: any) => area.id === id_area) || {};
            setAreaDataChosen(chooseArea);
        } else {
            setAreaDataChosen({});
        }
    }

    return (
        <HouseContext.Provider value={{ housesData, houseDataChosen, areaDataChosen, handleChoosenHouseByID, handleChooseAreaByID }}>
            {children}
        </HouseContext.Provider>
    );
};

export default HouseContextProvider;
