

import IconCPN from '@/components/Icon';
import variablesGlobal from '@/constants/variables';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-paper';
import {HouseContext, HouseContextProps} from '@/hooks/context/HouseData.context';
import fontsGlobal from '@/constants/fonts';
import { RoomWithRelationINF } from '@/interfaces/House.interface';
import RoomFetch from '@/fetch/Room.fetch';

const CreateRoomScreen = () => {
    const navigation = useNavigation();

    const { idHouseSelected, handleAddRoom } = React.useContext(HouseContext) as HouseContextProps;

    const [forcusRoomNameInput, setForcusRoomNameInput] = React.useState(false);
    const [forcusRoomDescInput, setForcusRoomDescInput] = React.useState(false);

    const [inputRoomName, setInputRoomName] = React.useState('');
    const [inputRoomDesc, setInputRoomDesc] = React.useState('');

    const [isAddRoom, setIsAddRoom] = React.useState(false);

    const [scrollY, setScrollY] = React.useState(0);

    const handleBackButton = () => {
        navigation.goBack();
    }

    useEffect(() => {
        if (inputRoomName !== '' || inputRoomDesc !== '') {
            setIsAddRoom(true);
        } else {
            setIsAddRoom(false);
        }
    }, [inputRoomName, inputRoomDesc]);

    const handleCreateRoom = async () => {

        Keyboard.dismiss();

        if (forcusRoomNameInput) setForcusRoomNameInput(false);
        if (forcusRoomDescInput) setForcusRoomDescInput(false);

        try {
            let response = await RoomFetch.create({id_house: idHouseSelected, name: inputRoomName, desc: inputRoomDesc});

            console.log('response: ', response);


            if (response.code === 200) {
                handleAddRoom({ ...response.data } as RoomWithRelationINF);
                // Đặt lại stack và chuyển hướng đến màn hình mới
                // Xoá lịch sử chuyển hướng
                navigation.reset({
                    index: 0,
                    routes: [ { name: "(main)", params: { screen: "(home)", params: { screen: "indexScreen" }}}]
                });
            }
        } catch (error) {
            console.log('Error in handleCreateRoom: ', error);
        }
        setIsAddRoom(false);
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
                        <Text style={[styles.headerClusterTittle_text]}>Thêm phòng</Text>
                    </View>

                    <View style={[styles.buttonBarRight]}>
                        {
                            (isAddRoom === true)
                            &&
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => handleCreateRoom()}
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
                        <Text style={styles.clusterInput_title}>TÊN PHÒNG</Text>
                        <View style={styles.clusterInput_boxTextInput}>
                            <TextInput
                                style={styles.clusterInput_boxTextInput_textInput}
                                placeholder='Phòng khách, nhà bếp, phòng ngủ,...'
                                placeholderTextColor='#999999'
                                value={inputRoomName}
                                onFocus={() => setForcusRoomNameInput(true)}
                                onBlur={() => setForcusRoomNameInput(false)}
                                onChange={(e) => setInputRoomName(e.nativeEvent.text)}
                            />
                            {
                                forcusRoomNameInput && inputRoomName.length > 0
                                &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setInputRoomName('');
                                        setForcusRoomNameInput(false);
                                    }}
                                >
                                    <IconCPN iconName="circleXmarkSolid" color="#c1c1c1"></IconCPN>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <Divider style={{ height: 20, backgroundColor: 'transparent' }}></Divider>

                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>GHI CHÚ PHÒNG</Text>
                        <View style={[styles.clusterInput_boxTextInput, {height: 140}]}>
                            <TextInput
                                style={[styles.clusterInput_boxTextInput_textInput]}
                                placeholder='Thêm ghi chú để bạn nhanh nhớ phòng của bạn hơn'
                                placeholderTextColor='#999999'
                                value={inputRoomDesc}
                                onFocus={() => setForcusRoomDescInput(true)}
                                onBlur={() => setForcusRoomDescInput(false)}
                                multiline={true}
                                numberOfLines={4}
                                onChange={(e) => setInputRoomDesc(e.nativeEvent.text)}
                            />
                        </View>
                    </View>

                    <Divider style={{ height: 80, backgroundColor: 'transparent' }}></Divider>
                </ScrollView>
            </View>

        </View>
    );
};

export default CreateRoomScreen;

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

