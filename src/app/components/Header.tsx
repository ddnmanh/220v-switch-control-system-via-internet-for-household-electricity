import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ImageBackground } from 'react-native';
import { ShadowView } from '@dotmind/rn-shadow-generator';
import { Divider } from 'react-native-paper';
import IconCPN from '../components/Icon';
import colorGlobal from '../constants/colors';
import variablesGlobal from '../constants/variables';
import PopoverOverlay from './PopoverOverlay';
import { HouseContext, HouseContextProps } from '@/hooks/context/HouseData.context';
import { useNavigation } from '@react-navigation/native';
import useMyAnimation from '@/hooks/animated/Animation.animated';
import { DynamicValuesContext } from '@/hooks/context/DynamicValues.context';
import imagesGlobal from '@/constants/images';
import { HouseWithRelationINF } from '@/interfaces/House.interface';

const HeaderCPN = ({ ...props }) => {

    const { dimensionsSize } = React.useContext(DynamicValuesContext) || { dimensionsSize: {width: 0, height: 0} };
    const { housesData, houseDataSelected, roomDataSelected, idHouseSelected, idRoomSelected, handleChoosenHouseByID, handleChooseRoomByID } = React.useContext(HouseContext) as HouseContextProps;

    const navigation = useNavigation();

    const btnAddRef = React.useRef<typeof TouchableOpacity | null>(null);
    const btnMoreRef = React.useRef<typeof TouchableOpacity | null>(null);

    const [toggleMoreDropDown, setToggleMoreDropDown] = React.useState(false);
    const [toggleAddDropDown, setToggleAddDropDown] = React.useState(false);



    const gatewayToggleDropDown = (dropDownName: string) => {
        switch (dropDownName) {
            case 'more':
                setToggleAddDropDown(false);
                setToggleMoreDropDown(prev => !prev);
                break;
            case 'add':
                setToggleMoreDropDown(false);
                setToggleAddDropDown(prev => !prev);
                break;
            default:
                setToggleAddDropDown(false);
                setToggleMoreDropDown(false);
                break;
        }
    }

    const backgroundOnHeaderAnimation = useMyAnimation({ opacity: 0, translateY: 0, scale: 1, rotate: 0});
    const houseNameOnHeaderAnimation = useMyAnimation({ opacity: 0, translateY: 0, scale: 1, rotate: 0});

    React.useEffect(() => {
        if (props.scrollY > 20) {
            backgroundOnHeaderAnimation.fadeIn(50);
            houseNameOnHeaderAnimation.fadeIn(200);
        } else {
            backgroundOnHeaderAnimation.fadeOut(50);
            houseNameOnHeaderAnimation.fadeOut(150);
        }
    }, [props.scrollY]);

    const handleGotoRoom = (roomID: string) => {
        handleChooseRoomByID && handleChooseRoomByID(roomID);
        gatewayToggleDropDown('more');

        navigation.navigate( "(main)", { screen: "(home)", params: { screen: "roomScreen", params: { idRoom: roomID } } });
    }

    const handleChangeChooseHouse = (id_house: string) => {

        gatewayToggleDropDown('more');

        if (id_house === idHouseSelected) {
            return;
        }

        handleChoosenHouseByID(id_house);
        handleChooseRoomByID('');
        // Đặt lại stack và chuyển hướng đến màn hình mới
        // Xoá lịch sử chuyển hướng
        navigation.reset({
            index: 0,
            routes: [ { name: "(main)", params: { screen: "(home)", params: { screen: "indexScreen" }}}]
        });
    }

    const handleGotoHouseSetting = () => {
        gatewayToggleDropDown('more');
        navigation.navigate("(house)", { screen: "housesetting" });
    }

    const handleGotoAddDevice = () => {
        gatewayToggleDropDown('add');
        navigation.navigate("(devices)", { screen: "addDevice", params: { idHouse: houseDataSelected?.id, idRoom: roomDataSelected?.id } });
    }

    const handleGotoRoomSettingScreen = () => {
        gatewayToggleDropDown('more');
        navigation.navigate("(room)", { screen: "roomSettingScreen", params: { idHouse: houseDataSelected?.id, idRoom: roomDataSelected?.id } });
    }

    const handleGotoCreateHouseScreen = () => {
        gatewayToggleDropDown('add');
        navigation.navigate("(house)", { screen: "createHouseScreen" });
    }

    const handleGotoCreateRoomScreen = () => {
        gatewayToggleDropDown('add');
        navigation.navigate("(room)", { screen: "createRoomScreen" });
    }


    return (
        <View style={[styles.header, { height: variablesGlobal.heightHeader }]}>
            <Animated.View
                style={[
                    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, },
                    { opacity: backgroundOnHeaderAnimation.animationValue.opacity },
                ]}
            >
                <ImageBackground
                    source={
                        houseDataSelected?.setting?.wallpaper_path
                            ? { uri: houseDataSelected?.setting?.wallpaper_path }
                            : imagesGlobal.WallpaperDefault
                    }
                    resizeMode='cover'
                    blurRadius={100}
                    style={styles.header_backgroundImg}
                    imageStyle={{
                        width: '100%',
                        height: dimensionsSize?.height,
                        transform: [{ translateY: -((dimensionsSize?.height || 0) - variablesGlobal.heightHeader) }],
                    }}
                ></ImageBackground>
            </Animated.View>

            <View style={styles.header_container}>
                {
                    props.showBackButton
                    &&
                    <TouchableOpacity
                        style={styles.backButton}
                        // onPress={() => navigation.navigate( "(main)", { screen: "(home)", params: { screen: "index" } } ) }
                        onPress={() => navigation.goBack() }
                    >
                        <IconCPN iconName='angleLeftRegular' size={18} color='#fff'></IconCPN>
                        <Text style={styles.backButton_text}>Nhà</Text>
                    </TouchableOpacity>
                }

                <Animated.View
                    style={[
                        styles.clusterText,
                        { opacity: houseNameOnHeaderAnimation.animationValue.opacity },
                    ]}
                >
                    <Text style={styles.clusterText_text}>{props.title || 'Nhà Của Bạn'}</Text>
                </Animated.View>

                <View style={styles.buttonBar}>

                    {/* For button add */}
                    <TouchableOpacity
                        ref={btnAddRef}
                        style={[styles.buttonBar_button]}
                        onPress={() => {
                            gatewayToggleDropDown('add');
                        }}
                    >
                        <IconCPN iconName={'plusRegular'} size={17} color={'#d4d4d8'}></IconCPN>
                        <View></View>
                    </TouchableOpacity>

                    <PopoverOverlay
                        visible={toggleAddDropDown}
                        buttonRef={btnAddRef} // Pass the button ref to PopoverOverlay
                        onClose={() => setToggleAddDropDown(false)}
                    >
                        <View style={[styles.dropDown]}>
                            <ShadowView
                                level={80}
                                shadowColor={'#000'}
                                direction={'bottomLeft'}
                                style={styles.dropDown_shadow}
                            >
                                {
                                    (housesData?.length >= 1)
                                    &&
                                    <Fragment>
                                        <TouchableOpacity
                                            style={styles.dropDown_item}
                                            onPress={() => handleGotoAddDevice()}
                                        >
                                            <View style={styles.dropDown_item_icon}></View>
                                            <Text style={styles.dropDown_item_text}>Thêm Thiết Bị</Text>
                                            <View style={styles.dropDown_item_icon}>
                                                <IconCPN iconName='lampRegular' size={13} color='#aaa'></IconCPN>
                                            </View>
                                        </TouchableOpacity>

                                        <Divider style={{ height: 1, backgroundColor: 'transparent' }}></Divider>

                                        <TouchableOpacity
                                            style={styles.dropDown_item}
                                            onPress={() => handleGotoCreateRoomScreen()}
                                        >
                                            <View style={styles.dropDown_item_icon}></View>
                                            <Text style={styles.dropDown_item_text}>Thêm Phòng</Text>
                                            <View style={[styles.dropDown_item_icon]}>
                                                <IconCPN iconName='doorOpenRegular' size={13} color='#aaa'></IconCPN>
                                            </View>
                                        </TouchableOpacity>

                                        <Divider style={{ height: 8, backgroundColor: 'transparent' }}></Divider>
                                    </Fragment>
                                }

                                <TouchableOpacity
                                    style={styles.dropDown_item}
                                    onPress={() => handleGotoCreateHouseScreen()}
                                >
                                    <View style={styles.dropDown_item_icon}></View>
                                    <Text style={styles.dropDown_item_text}>Thêm Nhà Mới</Text>
                                    <View style={[styles.dropDown_item_icon]}>
                                        <IconCPN iconName='homeRegular' size={13} color='#aaa'></IconCPN>
                                    </View>
                                </TouchableOpacity>
                            </ShadowView>
                        </View>
                    </PopoverOverlay>


                    {/* For button more */}

                    {
                        (housesData?.length >= 1)
                        &&
                        <Fragment>
                            <TouchableOpacity
                                ref={btnMoreRef}
                                style={[styles.buttonBar_button]}
                                onPress={() => {
                                    gatewayToggleDropDown('more');
                                }}
                            >
                                <IconCPN iconName={'circleEllipsis'} size={23} color={'#d4d4d8'}></IconCPN>
                                <View></View>
                            </TouchableOpacity>

                            <PopoverOverlay
                                visible={toggleMoreDropDown}
                                buttonRef={btnMoreRef} // Pass the button ref to PopoverOverlay
                                onClose={() => setToggleMoreDropDown(false)}
                            >
                                <View style={[styles.dropDown]}>
                                    <ShadowView
                                        level={80}
                                        shadowColor={'#000'}
                                        direction={'bottomLeft'}
                                        style={styles.dropDown_shadow}
                                    >
                                        {
                                            <>
                                                <TouchableOpacity
                                                    style={styles.dropDown_item}
                                                    onPress={() => {
                                                        handleGotoHouseSetting();
                                                    }}
                                                >
                                                    <View style={styles.dropDown_item_icon}></View>
                                                    <Text style={styles.dropDown_item_text}>Cài đặt nhà</Text>
                                                    <View style={styles.dropDown_item_icon}>
                                                        <IconCPN iconName='gearSolid' size={15} color='#aaa'></IconCPN>
                                                    </View>
                                                </TouchableOpacity>

                                                {
                                                    idRoomSelected !== ''
                                                    &&
                                                    <>
                                                        <Divider style={{ height: 1, backgroundColor: colorGlobal.border }}></Divider>
                                                        <TouchableOpacity
                                                            style={styles.dropDown_item}
                                                            onPress={() => {
                                                                handleGotoRoomSettingScreen();
                                                            }}
                                                        >
                                                            <View style={styles.dropDown_item_icon}></View>
                                                            <Text style={styles.dropDown_item_text}>Cài đặt phòng</Text>
                                                            <View style={styles.dropDown_item_icon}>
                                                                <IconCPN iconName='gearSolid' size={15} color='#aaa'></IconCPN>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </>
                                                }



                                                <Divider style={{ height: 8, backgroundColor: 'transparent' }}></Divider>

                                                {
                                                    housesData?.map((house: any, index: number) => (
                                                        <React.Fragment key={index}>
                                                            <TouchableOpacity
                                                                key={index}
                                                                style={styles.dropDown_item}
                                                                onPress={() => {
                                                                    handleChangeChooseHouse(house.id);
                                                                }}
                                                            >
                                                                <View style={styles.dropDown_item_icon}>
                                                                    {
                                                                        (idHouseSelected === house.id) && <IconCPN iconName='check' size={13} color='#aaa'></IconCPN>
                                                                    }
                                                                </View>
                                                                <Text style={styles.dropDown_item_text}>{house.name}</Text>
                                                                <View style={styles.dropDown_item_icon}></View>
                                                            </TouchableOpacity>
                                                            {
                                                                index < housesData.length - 1 && <Divider style={{ height: 1, backgroundColor: colorGlobal.border }}></Divider>
                                                            }
                                                        </React.Fragment>

                                                    ))
                                                }

                                                <Divider style={{ height: 8, backgroundColor: 'transparent' }}></Divider>

                                                {
                                                    houseDataSelected?.rooms?.map((room: any, index: number) => {

                                                        return (
                                                            <React.Fragment key={index}>
                                                                <TouchableOpacity
                                                                    key={index} style={styles.dropDown_item}
                                                                    onPress={() => handleGotoRoom(room.id)}
                                                                >
                                                                    <View style={styles.dropDown_item_icon}>
                                                                        {
                                                                            (idRoomSelected === room.id) && <IconCPN iconName='check' size={13} color='#aaa'></IconCPN>
                                                                        }
                                                                    </View>
                                                                    <Text style={styles.dropDown_item_text}>{room.name}</Text>
                                                                    <View style={styles.dropDown_item_icon}></View>
                                                                </TouchableOpacity>
                                                                {
                                                                    (index < houseDataSelected.rooms.length - 1) && <Divider style={{ height: 1, backgroundColor: colorGlobal.border }}></Divider>
                                                                }
                                                            </React.Fragment>
                                                        )
                                                    })
                                                }
                                            </>
                                        }
                                    </ShadowView>
                                </View>
                            </PopoverOverlay>

                        </Fragment>
                    }



                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    linearGradientBackground: {
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', zIndex: 99999, elevation: 99999,
    },
    backgroundImage: {
        flex: 1, width: '100%', height: '100%', zIndex: 0,
    },
    header: {
        flexDirection: 'row', alignItems: 'flex-end', zIndex: 99999, position: 'relative'
    },
    header_backgroundImg: {
        width: '100%', height: '100%', overflow: 'hidden',
    },
    header_container: {
        paddingBottom: 10, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal, flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', position: 'relative',
    },
    backButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 3, zIndex: 10,
    },
    backButton_text: {
        fontSize: 16, fontWeight: 'semibold', color: '#fff'
    },
    clusterText: {
        flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 10, // same as paddingBottom of header_container
    },
    clusterText_text: {
        textAlign: 'center', fontSize: 16, fontWeight: 'semibold', color: 'white',
    },
    buttonBar: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', columnGap: 20, zIndex: 10,
    },
    buttonBar_button: {
        backgroundColor: 'transparent', padding: 2, borderRadius: 100,
    },
    // DROP DOWN
    dropDown: {
        width: 230, backgroundColor: 'transparent', zIndex: 99999,
    },
    dropDown_shadow: {
        width: '100%', overflow: 'hidden', borderRadius: 10, backgroundColor: 'rgb(226, 226, 226)',
    },
    dropDown_item: {
        display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingLeft: 10, paddingRight: 18, backgroundColor: 'rgb(255, 255, 255)',
    },
    dropDown_item_icon: {
        width: 13
    },
    dropDown_item_iconLeft: {
    },
    dropDown_item_iconRight: {
    },
    dropDown_item_text: {
        flex: 1, color: '#000', fontSize: 15, lineHeight: 16, fontWeight: 'semibold', marginLeft: 6
    },

});

export default HeaderCPN;
