
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import HouseFetch from '@/fetch/House.fetch';
import { ResponseDTO } from '@/interfaces/API.interface';
import { AuthContext, AuthContextProps } from './Auth.context';
import { HouseWithRelationINF, OwnDeviceINF, RoomWithRelationINF } from '@/interfaces/House.interface';
import { useNavigation } from '@react-navigation/native';

export interface HouseContextProps {
    housesData: HouseWithRelationINF[];
    houseDataSelected: HouseWithRelationINF | null;
    roomDataSelected: RoomWithRelationINF | null;
    idHouseSelected: string;
    idRoomSelected: string;
    setHousesData: React.Dispatch<React.SetStateAction<any>>;
    handleChoosenHouseByID: (houseId: string) => void;
    handleChooseRoomByID: (roomId: string) => void;
    handleUpdateDataOwnDevice: (ownDeviceNew: OwnDeviceINF) => void;
    handleUpdateDataRoom(roomNew: RoomWithRelationINF): void;
    handleUpdateHouse(houseNew: HouseWithRelationINF): void;
    handleDeleteHouse(houseId: string): void;
    handleDeleteRoom(roomId: string): void;
    handleDeleteOwnDevice(ownDeviceId: string): void;
    handleAddHouse(houseNew: HouseWithRelationINF): void;
    handleAddRoom(roomNew: RoomWithRelationINF): void;
    reloadHouseContext: () => void;
}

export const HouseContext = createContext<HouseContextProps | undefined>(undefined);

interface HouseContextProviderProps {
    children: ReactNode;
}

const HouseContextProvider: React.FC<HouseContextProviderProps> = ({ children }) => {

    const navigation = useNavigation();

    const { userInfo } = React.useContext(AuthContext) as AuthContextProps;

    const [housesData, setHousesData] = useState<HouseWithRelationINF[]>([]);
    const [houseDataSelected, setHouseDataSelected] = useState<HouseWithRelationINF | null>(null);
    const [roomDataSelected, setRoomDataSelected] = useState<RoomWithRelationINF | null>(null);

    const [idHouseSelected, setIdHouseSelected] = useState<string>('');
    const [idRoomSelected, setIdRoomSelected] = useState<string>('');
    const [idOwnDeviceSelected, setIdOwnDeviceSelected] = useState<string>('');


    React.useEffect(() => {
        handleUpdateDataHouseSelected();
    }, [housesData, idHouseSelected]);

    const handleUpdateDataHouseSelected = () => {
        console.log('HANDLE UPDATE DATA HOUSE SELECTED');
        console.log(housesData.length);
        console.log(idHouseSelected);
        console.log("-------------------------------");



        if (housesData.length > 0) {
            if (idHouseSelected === '') {
                // Chọn nhà chính nếu có
                let mainHouse = housesData.find((house: HouseWithRelationINF) => house.setting?.is_main_house);

                if (mainHouse && Object.keys(mainHouse).length > 0) {
                    setHouseDataSelected(prev => mainHouse );
                    setIdHouseSelected(prev => mainHouse.id);
                } else {
                    setHouseDataSelected(prev => housesData[0]);
                    setIdHouseSelected(prev => housesData[0].id);
                }
            } else {
                // Kiểm tra xem houseId có tồn tại trong housesData không
                const chosenHouse = housesData.find((house: any) => house.id === idHouseSelected);
                if (chosenHouse && Object.keys(chosenHouse).length > 0) {
                    setHouseDataSelected(prev => chosenHouse);
                    setIdHouseSelected(prev => housesData[0].id);
                }
            }

        }
    };


    React.useEffect(() => {
        handleUpdateDataRoomSelected();
    }, [housesData, idHouseSelected, houseDataSelected, idRoomSelected]);

    const handleUpdateDataRoomSelected = () => {
        if (houseDataSelected && Object.keys(houseDataSelected).length > 0) {
            if (idRoomSelected !== '') {
                houseDataSelected.rooms.forEach((room: RoomWithRelationINF) => {
                    if (room.id === idRoomSelected) {
                        setRoomDataSelected({...room});
                    }
                });
            }
        }
    };

    const handleGetHouseWithAllRelations = useCallback(async () => {
        try {
            const response: ResponseDTO = await HouseFetch.getInfo("");
            if (response.code === 200) {
                const data = response.data?.length > 0 ? response.data : [];


                // Thêm các biến state, online cho các thiết bị
                let dataModified = data.map((house: HouseWithRelationINF) => {

                    let newOwnDeviceOnHouse = house.own_devices.map((ownDevice: OwnDeviceINF) => {
                        return {
                            ...ownDevice,
                            state: false,
                            online: false
                        }
                    });

                    let newRoom = house.rooms.map((rooms: RoomWithRelationINF) => {
                        let newOwnDevice = rooms.own_devices.map((ownDevice: any) => {
                            return {
                                ...ownDevice,
                                state: false,
                                online: false
                            }
                        });

                        return {
                            ...rooms,
                            own_devices: newOwnDevice
                        }
                    });

                    return {
                        ...house,
                        own_devices: newOwnDeviceOnHouse,
                        rooms: newRoom
                    }
                });
                setHousesData(dataModified);

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

    const handleChoosenHouseByID = (houseId: string) => {
        // Kiểm tra xem houseId có tồn tại trong housesData không
        const chosenHouse = housesData.find((house: any) => house.id === houseId);
        if ( chosenHouse && Object.keys(chosenHouse).length > 0) {
            setHouseDataSelected(chosenHouse);
            setIdHouseSelected(houseId);
        }
    };

    const handleChooseRoomByID = (roomId: string) => {
        if (roomId === '') {
            setIdRoomSelected('');
        } else {
            // Kiểm tra xem roomId có tồn tại trong housesData không
            const chosenRoom = housesData.find((house: any) => house.rooms.find((room: any) => room.id === roomId));
            if (chosenRoom && Object.keys(chosenRoom).length > 0) {
                if (idRoomSelected !== roomId) {
                    setIdRoomSelected(roomId);
                }
            }
        }

    };

    const handleUpdateDataOwnDevice = (ownDeviceNew: OwnDeviceINF) => {

        console.log('HANDLE UPDATE DATA OWN DEVICE');
        console.log(ownDeviceNew);



        setHousesData((prevData) => {
            return prevData.map((house: HouseWithRelationINF) => {

                let newOwnDeviceOnHouse = house.own_devices.map((ownDevice: OwnDeviceINF) => {
                    if (ownDevice.id === ownDeviceNew.id) {
                        return {
                            ...ownDevice,
                            name: ownDeviceNew.name,
                            desc: ownDeviceNew.desc,
                            state: ownDeviceNew.state,
                            online: ownDeviceNew.online,
                        }
                    }
                    return ownDevice;
                });

                let newRoom = house.rooms.map((rooms: RoomWithRelationINF) => {
                    let newOwnDevice = rooms.own_devices.map((ownDevice: any) => {
                        if (ownDevice.id === ownDeviceNew.id) {
                            return {
                                ...ownDevice,
                                name: ownDeviceNew.name,
                                desc: ownDeviceNew.desc,
                                state: ownDeviceNew.state,
                                online: ownDeviceNew.online,
                            }
                        }
                        return ownDevice;
                    });

                    return {
                        ...rooms,
                        own_devices: newOwnDevice
                    }
                });

                return {
                    ...house,
                    own_devices: newOwnDeviceOnHouse,
                    rooms: newRoom
                }
            });
        });

    }

    const handleUpdateHouse = (houseNew: HouseWithRelationINF) => {
        setHousesData((prevData) => {
            return prevData.map((house: any) => {
                if (house.id === houseNew.id) {
                    return {
                        ...house,
                        name: houseNew.name,
                        desc: houseNew.desc,
                    };
                }
                return house;
            });
        });
    }

    const handleUpdateDataRoom = (roomNew: RoomWithRelationINF) => {
        setHousesData((prevData) => {
            return prevData.map((house: any) => {
                let newRooms = house.rooms.map((room: any) => {
                    if (room.id === roomNew.id) {
                        return {
                            ...room,
                            name: roomNew.name,
                            desc: roomNew.desc,
                            own_devices: roomNew.own_devices
                        };
                    }
                    return room;
                });

                return {
                    ...house,
                    rooms: newRooms
                };
            });
        });
    }

    const handleDeleteRoom = (roomId: string) => {

        setHousesData((prevData) => {
            return prevData.map((house: any) => {
                let newRooms = house.rooms.filter((room: any) => room.id !== roomId);
                return {
                    ...house,
                    rooms: newRooms
                };
            });
        });
    }

    const handleDeleteOwnDevice = (ownDeviceId: string) => {
        setHousesData((prevData) => {
            return prevData.map((house: any) => {
                let newOwnDevices = house.own_devices.filter((ownDevice: any) => ownDevice.id !== ownDeviceId);
                let newRooms = house.rooms.map((room: any) => {
                    let newOwnDevices = room.own_devices.filter((ownDevice: any) => ownDevice.id !== ownDeviceId);
                    return {
                        ...room,
                        own_devices: newOwnDevices
                    };
                });

                return {
                    ...house,
                    own_devices: newOwnDevices,
                    rooms: newRooms
                };
            });
        });
    }

    const handleDeleteHouse = (houseId: string) => {
        setHousesData((prevData) => {
            let newHouse = housesData.filter((house: any) => house.id !== houseId);
            if (newHouse.length > 0) {
                setHouseDataSelected({...newHouse[0]});
                setIdHouseSelected(newHouse[0].id);
                // navigation.replace( "(main)", { screen: "(home)", params: { screen: "indexScreen" } } );
            } else {
                // Nếu không còn nhà nào thì set houseDataSelected = null
                setHouseDataSelected(null);
                setIdHouseSelected('');
                // navigation.replace('(house)', { screen: 'createHouseScreen' });
            }

            return newHouse;
        });
    }


    const handleAddHouse = (houseNew: HouseWithRelationINF) => {
        setHousesData(prevData => {
            return [...prevData, houseNew];
        });
    }

    const handleAddRoom = (roomNew: RoomWithRelationINF) => {
        setHousesData((prevData) => {
            return prevData.map((house: any) => {
                if (house.id === idHouseSelected) {
                    return {
                        ...house,
                        rooms: [...house.rooms, roomNew]
                    };
                }
                return house;
            });
        })
    }


    // console.log('HOUSE CONTEXT CHANGED');
    // console.log('HOUSE DATA', housesData[0]);
    // console.log('HOUSE DATA SELECTED', houseDataSelected?.rooms[0]);

    // console.log("HOUSE CONTEXT RENDER");
    // console.log(idHouseSelected);
    // console.log(houseDataSelected?.name);
    // console.log("-----------------");


    console.log('HOUSE CONTEXT RENDER');
    console.log(housesData[0]?.rooms[1]?.own_devices[0]);
    console.log(housesData[0]?.rooms[1]?.own_devices[1]);
    console.log(houseDataSelected?.rooms[1]?.own_devices[0]);
    console.log(houseDataSelected?.rooms[1]?.own_devices[1]);

    // const handleLog = () => {
    //     housesData[0].rooms[0].own_devices.forEach((ownDevice: any) => {
    //         console.log(ownDevice);
    //     });
    // }
    // handleLog();




    return (
        <HouseContext.Provider
            value={{
                housesData,
                houseDataSelected,
                roomDataSelected,
                idHouseSelected,
                idRoomSelected,
                setHousesData,
                handleChoosenHouseByID,
                handleChooseRoomByID,
                handleUpdateDataOwnDevice,
                handleUpdateDataRoom,
                handleUpdateHouse,
                handleDeleteHouse,
                handleDeleteRoom,
                handleDeleteOwnDevice,
                handleAddHouse,
                handleAddRoom,
                reloadHouseContext,
            }}
        >
            {children}
        </HouseContext.Provider>
    );
};

export default HouseContextProvider;
