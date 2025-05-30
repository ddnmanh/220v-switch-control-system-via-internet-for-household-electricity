

import IconCPN from '@/components/Icon';
import variablesGlobal from '@/constants/variables';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import Modal from "react-native-modal";
import { Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-paper';
import {HouseContext, HouseContextProps} from '@/hooks/context/HouseData.context';
import imagesGlobal from '@/constants/images';
import fontsGlobal from '@/constants/fonts';
import HouseFetch from '@/fetch/House.fetch';
import colorGlobal from '@/constants/colors';
import { HouseWithRelationINF } from '@/interfaces/House.interface';
import SwitchCPN from '@/components/Switch';

const Setting = () => {

    const navigation = useNavigation();
    const { houseDataSelected, handleUpdateHouse, handleDeleteHouse } = React.useContext(HouseContext) as HouseContextProps;

    const [forcusHouseNameInput, setForcusHouseNameInput] = React.useState(false);
    const [forcusHouseDescInput, setForcusHouseDescInput] = React.useState(false);

    const [newHouseName, setNewHouseName] = React.useState(houseDataSelected?.name || 'Tên nhà của tôi');
    const [newHouseDesc, setNewHouseDesc] = React.useState(houseDataSelected?.description || '');
    const [isMainHouse, setIsMainHouse] = React.useState(houseDataSelected?.is_main_house || false);

    const [isRenameHouse, setIsRenameHouse] = React.useState(false);

    const [openModalVerifyDeleteHouse, setOpenModalVerifyDeleteHouse] = React.useState(false);

    const [scrollY, setScrollY] = React.useState(0);

    const toggleModal = () => {
        setOpenModalVerifyDeleteHouse(prev => !prev);
    }

    const handleBackButton = () => {
        navigation.goBack();
    }

    useEffect(() => {
        if (newHouseName !== houseDataSelected?.name || newHouseDesc !== houseDataSelected?.description || isMainHouse !== houseDataSelected?.is_main_house) {
            setIsRenameHouse(true);
        } else {
            setIsRenameHouse(false);
        }
    }, [newHouseName, newHouseDesc, isMainHouse]);

    const handleUpdateHouseInfo = async () => {

        Keyboard.dismiss();

        if (forcusHouseNameInput) setForcusHouseNameInput(false);
        if (forcusHouseDescInput) setForcusHouseDescInput(false);

        try {
            let response = await HouseFetch.update({
                house_id: houseDataSelected?.id,
                name: newHouseName,
                description: newHouseDesc,
                wallpaper_blur: false,
                is_main_house: isMainHouse
            });

            if (response.status === 200 || response.status === 201) {
                handleUpdateHouse({...houseDataSelected, name: newHouseName, description: newHouseDesc} as HouseWithRelationINF);
            }
        } catch (error) {
            console.log('Error in handleUpdateHouseInfo: ', error);
        }
        setIsRenameHouse(false);
    }

    const handleDeleteThisHouse = async () => {
        try {
            let response = await HouseFetch.delete({house_id: houseDataSelected?.id});

            console.log('response: ', response);

            toggleModal();

            if (response.status === 200 || response.status === 201) {
                handleDeleteHouse(houseDataSelected?.id ? houseDataSelected?.id : '');
            }
        } catch (error) {
            console.log('Error in handleDeleteHouse: ', error);
        }

        navigation.reset({
            index: 0, // Đặt lại stack và chuyển hướng đến màn hình mới
            routes: [
                {
                    name: "(main)" as never, // Tên stack chính
                    params: {
                        screen: "(home)", // Tên stack con hoặc màn hình
                        params: {
                            screen: "indexScreen", // Tên màn hình thực tế bên trong
                        },
                    },
                },
            ],
        });

    }


    return (
        <View style={{backgroundColor: 'transparent', flex: 1}}>

            <View style={[styles.header, scrollY < 20 ? {backgroundColor: 'transparent', borderBottomColor: 'transparent'} : {} ]}>
                <View style={[styles.header_container, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <TouchableOpacity
                        style={[styles.headerButton]}
                        onPress={() => handleBackButton()}
                    >
                        <IconCPN iconName='angleLeftRegular' size={18} color='#FB923C'></IconCPN>
                        {/* Không có nội dung vẫn giữ Text để không bị vỡ layout */}
                        <Text style={[styles.headerButton_text]}></Text>
                    </TouchableOpacity>

                    <View style={[ styles.headerClusterTittle]}>
                        <Text style={[styles.headerClusterTittle_text]}>Cài đặt nhà</Text>
                    </View>

                    <View style={[styles.buttonBarRight]}>
                        {
                            (isRenameHouse === true)
                            &&
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => handleUpdateHouseInfo()}
                            >
                                <Text style={styles.headerButton_text}>Lưu</Text>
                            </TouchableOpacity>
                            ||
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => navigation.navigate("(house)", { screen: "housemange" })}
                            >
                                <Text style={styles.headerButton_text}>Quản lý</Text>
                            </TouchableOpacity>
                        }
                    </View>

                </View>
            </View>


            <View style={styles.content}>
                <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    onScroll={(event) => {
                        // Bắt sự kiện scroll và cập nhật giá trị scrollY
                        setScrollY(event.nativeEvent.contentOffset.y);
                    }}
                    scrollEventThrottle={1} // Tần suất gọi sự kiện onScroll
                >
                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>TÊN NHÀ</Text>
                        <View style={styles.clusterInput_boxTextInput}>
                            <TextInput
                                style={styles.clusterInput_boxTextInput_textInput}
                                placeholder='Tên nhà của tôi'
                                placeholderTextColor='#999999'
                                value={newHouseName}
                                onFocus={() => setForcusHouseNameInput(true)}
                                onBlur={() => setForcusHouseNameInput(false)}
                                onChange={(e) => setNewHouseName(e.nativeEvent.text)}
                            />
                            {
                                forcusHouseNameInput && newHouseName.length > 0
                                &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setNewHouseName('');
                                        setForcusHouseNameInput(false);
                                    }}
                                >
                                    <IconCPN iconName="circleXmarkSolid" color="#c1c1c1"></IconCPN>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <Divider style={{ height: 20, backgroundColor: 'transparent' }}></Divider>

                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>ẢNH NỀN CHÍNH</Text>
                        <View style={styles.clusterInput_box}>
                            <TouchableOpacity style={{paddingVertical: 10, paddingTop: 0}}>
                                <Text style={{ fontFamily: fontsGlobal.mainSemiBold, color: '#FB923C', fontSize: 15, lineHeight: 18  }}>Chụp Ảnh</Text>
                            </TouchableOpacity>
                            <Divider style={{ height: 1, backgroundColor: '#e4e4e7' }}></Divider>
                            <TouchableOpacity style={[{paddingVertical: 10}, {flex: 1, flexDirection: 'row', alignItems: 'center'}]}>
                                <Text style={{ flex: 1, fontFamily: fontsGlobal.mainSemiBold, color: '#000', fontSize: 15, }}>Chọn ảnh Có sẳn</Text>
                                <IconCPN iconName="angleLeftRegular" color="#c1c1c1" rotate={180} size={12}></IconCPN>
                            </TouchableOpacity>
                            <Divider style={{ height: 1, backgroundColor: '#e4e4e7' }}></Divider>
                            <View style={{paddingVertical: 10, paddingBottom: 0}}>
                                <Image
                                    source={
                                        houseDataSelected?.house_wallpaper?.path
                                            ? { uri: process.env.EXPO_PUBLIC_DOMAIN_SERVER_STATIC + houseDataSelected?.house_wallpaper?.path }
                                            : imagesGlobal.WallpaperDefault
                                    }
                                    resizeMode="contain"
                                    style={{ width: '100%', height: 250 }}
                                />
                            </View>
                        </View>
                    </View>

                    <Divider style={{ height: 20, backgroundColor: 'transparent' }}></Divider>

                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>GHI CHÚ NHÀ</Text>
                        <View style={[styles.clusterInput_boxTextInput, {height: 140}]}>
                            <TextInput
                                style={[styles.clusterInput_boxTextInput_textInput]}
                                placeholder='Thêm ghi chú để bạn nhanh nhớ ngôi nhà của bạn hơn'
                                placeholderTextColor='#999999'
                                value={newHouseDesc}
                                onFocus={() => setForcusHouseDescInput(true)}
                                onBlur={() => setForcusHouseDescInput(false)}
                                multiline={true}
                                numberOfLines={4}
                                onChange={(e) => setNewHouseDesc(e.nativeEvent.text)}
                            />
                        </View>
                    </View>

                    <Divider style={{ height: 20, backgroundColor: 'transparent' }}></Divider>

                    <View
                        style={{
                            width: '100%',
                            paddingHorizontal: 16,
                            paddingVertical: 16,
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            overflow: 'hidden' // Ngăn các phần tử tràn ra bên ngoài
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '400',
                                color: colorGlobal.textPrimary,
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis' // Thêm dấu "..." nếu text bị cắt bớt
                            }}
                        >
                            Đặt là nhà chính
                        </Text>
                        <SwitchCPN
                            value={isMainHouse}
                            onValueChange={() => setIsMainHouse(prev => !prev)}
                        ></SwitchCPN>
                    </View>

                    <Divider style={{ height: 40, backgroundColor: 'transparent' }}></Divider>

                    <TouchableOpacity
                        style={styles.clusterInput_box}
                        onPress={() => setOpenModalVerifyDeleteHouse(true)}
                    >
                        <Text style={[styles.clusterInput_box_text, {color: 'red'}]}>Xoá Nhà Này</Text>
                    </TouchableOpacity>

                    <Divider style={{ height: 80, backgroundColor: 'transparent' }}></Divider>
                </ScrollView>
            </View>


            <Modal
                isVisible={openModalVerifyDeleteHouse}
                onBackdropPress={toggleModal}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropColor="rgba(0, 0, 0, 0.5)"
                useNativeDriver={true}
                // hideModalContentWhileAnimating={true} // Giảm hiện tượng nhấp nháy
                // statusBarTranslucent={true} // Để modal che phủ thanh trạng thái
                style={styles.bottomModal}
            >
                <View style={styles.modalContent}>

                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", borderRadius: 13, overflow: 'hidden'}}>
                        <View style={{width: '100%', paddingHorizontal: 30, paddingVertical: 15, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 6, backgroundColor: colorGlobal.subBackColor}}>
                            <Text style={{fontSize: 18, fontWeight: '500', color: colorGlobal.textSecondary}}>Xoá nhà</Text>
                            <Text style={{fontSize: 12, fontWeight: '400', textAlign: 'center', color: colorGlobal.textSecondary}}>Khi xoá nhà, các dữ liệu về nhà này sẽ bị xoá và không thể khôi phục, các thiết bị thuộc nhà này sẽ ở chế độ chờ kết nối lại</Text>
                        </View>
                        <Divider style={{width: '100%', height: 1.8, backgroundColor: '#e4e4e7'}}></Divider>
                        <TouchableOpacity
                            style={{width: '100%', height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colorGlobal.subBackColor}}
                            activeOpacity={0.4}
                            onPress={() => handleDeleteThisHouse()}
                        >
                            <Text style={{fontSize: 18, fontWeight: '500', color: 'red'}}>Xoá</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{width: '100%', height: 50, borderRadius: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}
                        activeOpacity={0.7}
                        onPress={() => setOpenModalVerifyDeleteHouse(prev => !prev)}
                    >
                        <Text style={{fontSize: 18, fontWeight: '500', color: '#FB923C'}}>Huỷ</Text>
                    </TouchableOpacity>

                </View>
            </Modal>

        </View>
    );
};

export default Setting;

const styles = StyleSheet.create({
    // Header
    header: {
        height: 87, flexDirection: 'row', alignItems: 'flex-end', zIndex: 99999, position: 'relative',
        borderBottomWidth: 1, borderBottomColor: '#e4e4e7', backgroundColor: '#fff'
    },
    header_container: {
        marginBottom: 10, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal,
        flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', position: 'relative',
    },
    headerButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 3, zIndex: 10,
    },
    headerButton_text: {
        fontSize: 16, fontFamily: fontsGlobal.mainSemiBold, color: '#FB923C'
    },
    headerClusterTittle: {
        flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, // same as paddingBottom of header_container
    },
    headerClusterTittle_text: {
        textAlign: 'center', fontSize: 16, fontFamily: fontsGlobal.mainSemiBold, color: '#000'
    },
    buttonBarRight: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', columnGap: 20, zIndex: 10,
    },

    //
    content: {
        flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, height: '100%'
    },
    scroll: {
        flex: 1, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal, paddingTop: 20
    },
    clusterInput: {
        width: '100%', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', rowGap: 4
    },
    clusterInput_title: {
        fontSize: 12, fontFamily: fontsGlobal.mainSemiBold, color: '#a1a1aa', marginLeft: 16,
    },
    clusterInput_boxTextInput: {
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 10,
    },
    clusterInput_boxTextInput_textInput: {
        paddingVertical: 0, paddingHorizontal: 0, flex: 1, backgroundColor: 'transparent', fontSize: 15, color: '#000', fontFamily: fontsGlobal.mainSemiBold,
        height: '100%', textAlign: 'left', textAlignVertical: 'top'
    },
    clusterInput_box: {
        paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 10,
    },
    clusterInput_box_text: {
        fontSize: 15, fontFamily: fontsGlobal.mainSemiBold, color: '#000', lineHeight: 18,
    },

    // Modal
    bottomModal: {
        margin: 0, // Đảm bảo modal chiếm toàn màn hình
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '96%',
        marginHorizontal: '2%',
        marginBottom: 20,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'stretch',
        rowGap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#E5E5E5',
    },
    deleteButtonModal: {
        backgroundColor: '#FF3B30',
    },
    cancelText: {
        color: '#000',
        fontSize: 16,
    },
    deleteText: {
        color: '#FFF',
        fontSize: 16,
    },
});

