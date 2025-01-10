
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image, TouchableHighlight } from 'react-native';
import React, { useContext } from 'react';
import colorGlobal from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import OwnDeviceFetch from '@/fetch/OwnDevice.fetch';
import { HouseContext, HouseContextProps } from '@/hooks/context/HouseData.context';
import variablesGlobal from '@/constants/variables';
import IconCPN from '@/components/Icon';
import { SwitchDeviceITF } from '@/components/devices/SwitchItem';
import Modal from "react-native-modal";
import { Divider } from 'react-native-paper';


const SettingDevice = ({route}: any) => {

    const { idArea, device } = route.params;

    const navigation = useNavigation();

    const { handleUpdateDataSwitchDevice } = useContext(HouseContext) as HouseContextProps;

    const [thisDevice, setThisDevice] = React.useState<SwitchDeviceITF>(device);

    React.useEffect(() => {
        if (thisDevice) handleUpdateDataSwitchDevice(thisDevice.id_device, thisDevice?.state, thisDevice.online, thisDevice?.name);
    }, [thisDevice]);


    const handleBackButton = () => {
        navigation.goBack();
    };

    const [openModalVerifyDeleteDevice, setOpenModalVerifyDeleteDevice] = React.useState<boolean>(false);

    const toggleModal = () => {
        setOpenModalVerifyDeleteDevice(!openModalVerifyDeleteDevice);
    };

    const handleDeleteDevice = async () => {
        try {
            const response = await OwnDeviceFetch.delete({id_device: thisDevice.id_device});
            if (response.code === 200) {
                setThisDevice({} as SwitchDeviceITF);
                setOpenModalVerifyDeleteDevice(false);
                setTimeout(() => {
                    navigation.navigate("(main)", { screen: '(home)', params: { screen: 'index' } });
                }, 500);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0}}>

                <View style={[styles.header]}>
                    <View style={[styles.header_container, { alignItems: 'center', justifyContent: 'center' }]}>
                        <TouchableOpacity
                            style={[styles.backButton]}
                            onPress={() => handleBackButton()}

                        >
                            <IconCPN iconName='angleLeftRegular' size={18} color='#FB923C'></IconCPN>
                        </TouchableOpacity>

                        <View style={[ styles.clusterText]}>
                            <Text style={[styles.clusterText_text, {color: "#000"}]}>Cài đặt</Text>
                        </View>

                        <View style={styles.buttonBar}></View>

                    </View>
                </View>

                <View style={{width: '100%', height: '100%', paddingTop: 20, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal, backgroundColor: colorGlobal.subBackColor, flexDirection: 'column', rowGap: 10}}>

                    <TouchableOpacity
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

                        onPress={() => navigation.navigate('logDeviceScreen', { idArea: idArea, device: thisDevice })}
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
                            Lịch sử hoạt động
                        </Text>
                        <IconCPN
                            iconName='angleRightRegular'
                            size={12}
                            color={colorGlobal.textPrimary}
                        />
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden'}}
                        onPress={() => setOpenModalVerifyDeleteDevice(prev => !prev)}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '500',
                                color: 'red',
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis' // Thêm dấu "..." nếu text bị cắt bớt
                            }}
                        >
                            Xoá Thiết Bị Này
                        </Text>
                    </TouchableOpacity>


                    <Modal
                        isVisible={openModalVerifyDeleteDevice}
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

                            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colorGlobal.subBackColor, borderRadius: 13, overflow: 'hidden'}}>
                                <View style={{width: '100%', paddingHorizontal: 30, paddingVertical: 15, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 6, backgroundColor: 'transparent'}}>
                                    <Text style={{fontSize: 18, fontWeight: '500', color: colorGlobal.textSecondary}}>Xoá thiết bị</Text>
                                    <Text style={{fontSize: 12, fontWeight: '400', textAlign: 'center', color: colorGlobal.textSecondary}}>Khi bạn xoá, thiết bị sẽ bị xoá và không thể điều khiển qua ứng dụng, điều khiển ở thiết bị vẫn hoạt động</Text>
                                </View>
                                <Divider style={{width: '100%', height: 1.8, backgroundColor: '#e4e4e7'}}></Divider>
                                <TouchableOpacity
                                    style={{width: '100%', height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}
                                    activeOpacity={0.4}
                                    onPress={() => handleDeleteDevice()}
                                >
                                    <Text style={{fontSize: 18, fontWeight: '500', color: 'red'}}>Xoá</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={{width: '100%', height: 50, borderRadius: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}
                                activeOpacity={0.7}
                                onPress={() => setOpenModalVerifyDeleteDevice(prev => !prev)}
                            >
                                <Text style={{fontSize: 18, fontWeight: '500', color: '#FB923C'}}>Huỷ</Text>
                            </TouchableOpacity>

                        </View>
                    </Modal>


                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 87, flexDirection: 'row', alignItems: 'flex-end', zIndex: 99999, position: 'relative', backgroundColor: 'transparent',
    },
    header_container: {
        paddingBottom: 10, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal,
        flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', position: 'relative',
    },
    backButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 3, zIndex: 10,
    },
    backButton_text: {
        fontSize: 16, fontFamily: 'SanFranciscoText-SemiBold', color: '#FB923C'
    },
    clusterText: {
        flex: 1, position: 'absolute', top: 2, left: 0, right: 0, bottom: 0, // same as paddingBottom of header_container
    },
    clusterText_text: {
        textAlign: 'center', fontSize: 16, fontFamily: 'SanFranciscoText-SemiBold', color: 'white',
    },
    buttonBar: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', columnGap: 20, zIndex: 10,
    },
    buttonBar_button: {
        padding: 2, borderRadius: 100,
    },
    buttonBar_buttonText: {
        fontSize: 16, fontFamily: 'SanFranciscoText-SemiBold', color: '#FB923C'
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

export default SettingDevice;
