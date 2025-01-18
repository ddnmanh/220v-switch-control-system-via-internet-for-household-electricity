

import IconCPN from '@/components/Icon';
import variablesGlobal from '@/constants/variables';
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {HouseContext, HouseContextProps} from '@/hooks/context/HouseData.context';
import fontsGlobal from '@/constants/fonts';
import RoomFetch from '@/fetch/Room.fetch';
import { Divider } from 'react-native-paper';
import colorGlobal from '@/constants/colors';
import { ResponseDTO } from '@/interfaces/API.interface';
import { RoomWithRelationINF } from '@/interfaces/House.interface';

const RoomSettingScreen = () => {

    const navigation = useNavigation();
    const { roomDataSelected, handleUpdateDataRoom, handleDeleteRoom } = React.useContext(HouseContext) as HouseContextProps;

    const [thisRoomData, setThisRoomData] = React.useState<RoomWithRelationINF | null>(roomDataSelected);

    const [forcusRoomNameInput, setForcusRoomNameInput] = React.useState(false);
    const [forcusRoomDescInput, setForcusRoomDescInput] = React.useState(false);

    const [newRoomName, setNewRoomName] = React.useState(roomDataSelected?.name || '');
    const [newRoomDesc, setNewRoomDesc] = React.useState(roomDataSelected?.desc || '');


    const [isChangeRoomInfo, setIsChangeRoomInfo] = React.useState(false);

    const [openModalVerifyDeleteRoom, setOpenModalVerifyDeleteRoom] = React.useState(false);
    const toggleModal = () => {
        setOpenModalVerifyDeleteRoom(prev => !prev);
    }


    React.useEffect(() => {
        if (roomDataSelected && Object.keys(roomDataSelected).length > 0 && JSON.stringify(roomDataSelected) !== JSON.stringify(thisRoomData)) {
            setThisRoomData(roomDataSelected);
            setNewRoomName(roomDataSelected?.name);
            setNewRoomDesc(roomDataSelected?.desc);
        }
    }, [roomDataSelected]);


    React.useEffect(() => {
        if (newRoomName !== thisRoomData?.name || newRoomDesc !== thisRoomData?.desc) {
            setIsChangeRoomInfo(true);
        } else {
            setIsChangeRoomInfo(false);
        }
    }, [newRoomName, newRoomDesc]);



    const [scrollY, setScrollY] = React.useState(0);

    const handleBackButton = () => {
        navigation.goBack();
    }

    const handleGoToHomeScreen = () => {
        navigation.navigate( "(main)", { screen: "(home)", params: { screen: "indexScreen" } });
    }

    const handleUpdateRoomInfo = async () => {
        Keyboard.dismiss();

        try {
            let response:ResponseDTO = await RoomFetch.update({room_id: thisRoomData?.id, name: newRoomName, desc: newRoomDesc});


            if (response.code === 200) {
                handleUpdateDataRoom({...thisRoomData, name: newRoomName, desc: newRoomDesc} as RoomWithRelationINF);
            }

        } catch (error) {
            console.log('Error: ', error);
        }
        setIsChangeRoomInfo(false);
    }

    const handleDeleteThisRoom = async () => {
        try {
            let response = await RoomFetch.delete({room_id: thisRoomData?.id});
            if (response.code === 200) {
                handleDeleteRoom(thisRoomData?.id ? thisRoomData?.id : '');
                handleGoToHomeScreen();
            }
        } catch (error) {
            console.log('Error: ', error);
        }
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
                        <Text style={[styles.headerClusterTittle_text]}>Cài đặt phòng</Text>
                    </View>

                    <View style={[styles.buttonBarRight]}>
                        {
                            isChangeRoomInfo === true
                            &&
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => handleUpdateRoomInfo()}
                            >
                                <Text style={styles.headerButton_text}>Xong</Text>
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
                    contentContainerStyle={{rowGap: 20}}
                >
                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>TÊN PHÒNG</Text>
                        <View style={styles.clusterInput_boxTextInput}>
                            <TextInput
                                style={styles.clusterInput_boxTextInput_textInput}
                                placeholder='Tên nhà của tôi'
                                placeholderTextColor='#999999'
                                value={newRoomName}
                                onFocus={() => setForcusRoomNameInput(true)}
                                onBlur={() => setForcusRoomNameInput(false)}
                                onChange={(e) => setNewRoomName(e.nativeEvent.text)}
                            />
                            {
                                forcusRoomNameInput && newRoomName.length > 0
                                &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setNewRoomName('');
                                        setForcusRoomNameInput(false);
                                    }}
                                >
                                    <IconCPN iconName="circleXmarkSolid" color="#c1c1c1"></IconCPN>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>


                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>GHI CHÚ PHÒNG</Text>
                        <View style={[styles.clusterInput_boxTextInput, {height: 140}]}>
                            <TextInput
                                style={[styles.clusterInput_boxTextInput_textInput]}
                                placeholder='Thêm ghi chú để bạn nhanh nhớ ngôi nhà của bạn hơn'
                                placeholderTextColor='#999999'
                                value={newRoomDesc}
                                onFocus={() => setForcusRoomDescInput(true)}
                                onBlur={() => setForcusRoomDescInput(false)}
                                multiline={true}
                                numberOfLines={4}
                                onChange={(e) => setNewRoomDesc(e.nativeEvent.text)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.clusterInput_box}
                        onPress={() => setOpenModalVerifyDeleteRoom(true)}
                    >
                        <Text style={[styles.clusterInput_box_text, {color: 'red'}]}>Xoá Phòng Này</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>


            <Modal
                isVisible={openModalVerifyDeleteRoom}
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
                            <Text style={{fontSize: 18, fontWeight: '500', color: colorGlobal.textSecondary}}>Xoá phòng</Text>
                            <Text style={{fontSize: 12, fontWeight: '400', textAlign: 'center', color: colorGlobal.textSecondary}}>Khi xoá phòng, các dữ liệu về phòng này sẽ bị xoá và không thể khôi phục, các thiết bị thuộc phòng này sẽ ở chế độ chờ kết nối lại</Text>
                        </View>
                        <Divider style={{width: '100%', height: 1.8, backgroundColor: '#e4e4e7'}}></Divider>
                        <TouchableOpacity
                            style={{width: '100%', height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colorGlobal.subBackColor}}
                            activeOpacity={0.4}
                            onPress={() => handleDeleteThisRoom()}
                        >
                            <Text style={{fontSize: 18, fontWeight: '500', color: 'red'}}>Xoá</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{width: '100%', height: 50, borderRadius: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}
                        activeOpacity={0.7}
                        onPress={() => setOpenModalVerifyDeleteRoom(prev => !prev)}
                    >
                        <Text style={{fontSize: 18, fontWeight: '500', color: '#FB923C'}}>Huỷ</Text>
                    </TouchableOpacity>

                </View>
            </Modal>


        </View>
    );
};

export default RoomSettingScreen;

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

