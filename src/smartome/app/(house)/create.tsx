

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

const CreateHouseScreen = () => {
    const navigation = useNavigation();

    const { handleAddHouse } = React.useContext(HouseContext) as HouseContextProps;

    const [forcusHouseNameInput, setForcusHouseNameInput] = React.useState(false);
    const [forcusHouseDescInput, setForcusHouseDescInput] = React.useState(false);

    const [inputHouseName, setInputHouseName] = React.useState('');
    const [inputHouseDesc, setInputHouseDesc] = React.useState('');

    const [isAddHouse, setIsAddHouse] = React.useState(false);

    const [scrollY, setScrollY] = React.useState(0);

    const handleBackButton = () => {
        navigation.goBack();
    }

    useEffect(() => {
        if (inputHouseName !== '' || inputHouseDesc !== '') {
            setIsAddHouse(true);
        } else {
            setIsAddHouse(false);
        }
    }, [inputHouseName, inputHouseDesc]);

    const handleCreateHouse = async () => {

        Keyboard.dismiss();

        if (forcusHouseNameInput) setForcusHouseNameInput(false);
        if (forcusHouseDescInput) setForcusHouseDescInput(false);

        try {
            let response = await HouseFetch.create({name: inputHouseName, desc: inputHouseDesc, is_wallpaper_blur: false});

            console.log('response: ', response);


            if (response.code === 200) {
                handleAddHouse({ ...response.data } as HouseWithRelationINF);
                // Đặt lại stack và chuyển hướng đến màn hình mới
                // Xoá lịch sử chuyển hướng
                navigation.reset({
                    index: 0,
                    routes: [ { name: "(main)", params: { screen: "(home)", params: { screen: "indexScreen" }}}]
                });
            }
        } catch (error) {
            console.log('Error in handleCreateHouse: ', error);
        }
        setIsAddHouse(false);
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
                        <Text style={[styles.headerClusterTittle_text]}>Thêm nhà mới</Text>
                    </View>

                    <View style={[styles.buttonBarRight]}>
                        {
                            (isAddHouse === true)
                            &&
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => handleCreateHouse()}
                            >
                                <Text style={styles.headerButton_text}>Thêm</Text>
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
                                value={inputHouseName}
                                onFocus={() => setForcusHouseNameInput(true)}
                                onBlur={() => setForcusHouseNameInput(false)}
                                onChange={(e) => setInputHouseName(e.nativeEvent.text)}
                            />
                            {
                                forcusHouseNameInput && inputHouseName.length > 0
                                &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setInputHouseName('');
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
                                    source={ imagesGlobal.WallpaperDefault }
                                    resizeMode="contain"
                                    style={{ width: '100%', height: 250, borderRadius: 10 }}
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
                                value={inputHouseDesc}
                                onFocus={() => setForcusHouseDescInput(true)}
                                onBlur={() => setForcusHouseDescInput(false)}
                                multiline={true}
                                numberOfLines={4}
                                onChange={(e) => setInputHouseDesc(e.nativeEvent.text)}
                            />
                        </View>
                    </View>

                    <Divider style={{ height: 80, backgroundColor: 'transparent' }}></Divider>
                </ScrollView>
            </View>

        </View>
    );
};

export default CreateHouseScreen;

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
});

