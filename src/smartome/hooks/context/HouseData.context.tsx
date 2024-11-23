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
        image_bg: 'https://picsum.photos/id/28/360/761',
        areas: [
            {
                id: 1,
                name: 'Phòng khách',
                devices: [
                    {
                        id: 1,
                        name: 'Đèn trần',
                        online: false,
                        state: false,
                        topicSend: "sw1/receive",
                        topicReceive: "sw1/send"
                    },
                    {
                        id: 2,
                        name: 'Quạt trần',
                        online: false,
                        state: false,
                        topicSend: "sw2/receive",
                        topicReceive: "sw2/send"
                    },
                    {
                        id: 3,
                        name: 'Điều hòa trái',
                        online: false,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 4,
                        name: 'Điều hòa phải',
                        online: false,
                        state: true,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
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
                        online: true,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 2,
                        name: 'Đèn ngủ',
                        online: true,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 3,
                        name: 'Điều hòa',
                        online: false,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
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
                        online: true,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 2,
                        name: 'Đèn lớn',
                        online: true,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 3,
                        name: 'Bếp điện',
                        online: false,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Nhà Trọ',
        image_bg: 'https://picsum.photos/id/20/360/761',
        areas: [
            {
                id: 1,
                name: 'Không gian chính',
                devices: [
                    {
                        id: 1,
                        name: 'Đèn lớn',
                        online: true,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 2,
                        name: 'Quạt để bàn',
                        online: true,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 3,
                        name: 'Nguồn điện cho máy tính',
                        online: false,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
                    },
                    {
                        id: 4,
                        name: 'Đèn ngủ',
                        online: false,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
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
                        online: true,
                        state: false,
                        topicSend: "temporary/receive",
                        topicReceive: "temporary/send"
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
