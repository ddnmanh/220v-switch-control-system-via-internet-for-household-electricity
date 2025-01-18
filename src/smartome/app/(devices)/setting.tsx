
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image, TouchableHighlight, Switch } from 'react-native';
import React, { useContext } from 'react';
import colorGlobal from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import OwnDeviceFetch from '@/fetch/OwnDevice.fetch';
import { HouseContext, HouseContextProps } from '@/hooks/context/HouseData.context';
import variablesGlobal from '@/constants/variables';
import IconCPN from '@/components/Icon';
import Modal from "react-native-modal";
import { Divider } from 'react-native-paper';
import fontsGlobal from '@/constants/fonts';
import { OwnDeviceINF } from '@/interfaces/House.interface';
import { useMQTTContext } from '@/hooks/context/MQTT.context';


const SettingDevice = () => {

    const navigation = useNavigation();

    const {
        publishToTopicMQTT,
    } = useMQTTContext();


    const { handleUpdateDataOwnDevice, handleDeleteOwnDevice, ownDeviceDataSelected } = useContext(HouseContext) as HouseContextProps;

    const [thisOwnDevice, setThisOwnDevice] = React.useState<OwnDeviceINF | null>(ownDeviceDataSelected);

    const [deviceSaveState, setDeviceSaveState] = React.useState<boolean>(ownDeviceDataSelected?.is_save_state || false);
    const [deviceResetFromApp, setDeviceResetFromApp] = React.useState<boolean>(ownDeviceDataSelected?.is_verify_reset_from_app || false);


    React.useEffect(() => {
        if (ownDeviceDataSelected && Object.keys(ownDeviceDataSelected).length > 0 && JSON.stringify(ownDeviceDataSelected) !== JSON.stringify(thisOwnDevice)) {
            setThisOwnDevice(ownDeviceDataSelected);
            setDeviceSaveState(ownDeviceDataSelected.is_save_state);
            setDeviceResetFromApp(ownDeviceDataSelected.is_verify_reset_from_app);
        }
    }, [ownDeviceDataSelected]);

    React.useEffect(() => {
        if (thisOwnDevice) handleUpdateDataOwnDevice(thisOwnDevice);
    }, [thisOwnDevice]);

    const handleBackButton = () => {
        navigation.goBack();
    };

    const [openModalVerifyDeleteDevice, setOpenModalVerifyDeleteDevice] = React.useState<boolean>(false);

    const toggleModal = () => {
        setOpenModalVerifyDeleteDevice(!openModalVerifyDeleteDevice);
    };

    const handleDeleteDevice = async () => {

        handleResetToEquipment("RESET");

        try {
            const response = await OwnDeviceFetch.delete({id_own_device: thisOwnDevice?.id});
            if (response.code === 200) {
                setThisOwnDevice(null);
                handleDeleteOwnDevice(thisOwnDevice?.id || "");
                setOpenModalVerifyDeleteDevice(false);
                setTimeout(() => {
                    navigation.navigate("(main)", { screen: '(home)', params: { screen: 'index' } });
                }, 500);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const idMQTTRequire = React.useRef<string>("");

    const handleResetToEquipment = (type: string = "RESET") => {
        const strTimestamp = new Date().getTime().toString();
        idMQTTRequire.current = strTimestamp;
        publishToTopicMQTT(
            thisOwnDevice?.mqtt_topic_send || "",
            JSON.stringify({
                type: type,
                id: strTimestamp
            })
        );
    };

    const handleSettingToEquipment = (type: string = "SETTING", saveState: boolean = false, resetFromApp: boolean = false) => {
        const strTimestamp = new Date().getTime().toString();
        idMQTTRequire.current = strTimestamp;
        publishToTopicMQTT(
            thisOwnDevice?.mqtt_topic_send || "",
            JSON.stringify({
                type: type,
                id: strTimestamp,
                save_state: saveState,
                reset_from_app: resetFromApp
            })
        );
    };

    const handleToggleSaveStateSwitch = async (type: string = "") => {

        let newSaveState = deviceSaveState;
        let newResetFromApp = deviceResetFromApp;

        if (type == "STATE") {
            newSaveState = !deviceSaveState;
            setDeviceSaveState(newSaveState);
        }

        if (type == "RESET") {
            newResetFromApp = !deviceResetFromApp;
            setDeviceResetFromApp(newResetFromApp);
        }

        // Cập nhật trạng thái mới
        handleSettingToEquipment("SETTING", newSaveState, newResetFromApp);

        try {
            // Sử dụng giá trị mới trong API call
            const response = await OwnDeviceFetch.update({
                id_own_device: thisOwnDevice?.id,
                name: thisOwnDevice?.name,
                desc: thisOwnDevice?.desc,
                is_save_state: newSaveState,
                is_verify_reset_from_app: newResetFromApp
            });

            console.log(' -----------> Response update device save state:', response);


            if (response.code === 200) {
                setThisOwnDevice(prev => (prev ? { ...prev, is_save_state: newSaveState, is_verify_reset_from_app: newResetFromApp } : null));
            }
        } catch (error) {
            console.error('Error updating device save state:', error);
        }
    };

    // console.log("----------------------------------------");
    // console.log('SETTING DEVICE ', ownDeviceDataSelected);
    // console.log("----------------------------------------");

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0}}>

                <View style={[styles.header, {backgroundColor: 'transparent', borderBottomColor: 'transparent'}]}>
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
                            <Text style={[styles.headerClusterTittle_text, {color: "#000"}]}>Cài đặt thiết bị</Text>
                        </View>

                        {/* Không có nội dung vẫn giữ Text để không bị vỡ layout */}
                        <View style={[styles.buttonBarRight]}>
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => {}}
                            >
                                <Text style={styles.headerButton_text}></Text>
                            </TouchableOpacity>
                        </View>

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

                        onPress={() => navigation.navigate('logDeviceScreen')}
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
                            Lưu trạng thái cuối
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: colorGlobal.primary }}
                            thumbColor={deviceSaveState ? colorGlobal.primary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => handleToggleSaveStateSwitch("STATE")}
                            value={deviceSaveState}
                        />
                    </View>

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
                            Reset thiết bị từ ứng dụng
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: colorGlobal.primary }}
                            thumbColor={deviceResetFromApp ? colorGlobal.primary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => handleToggleSaveStateSwitch("RESET")}
                            value={deviceResetFromApp}
                        />
                    </View>


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

                            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", borderRadius: 13, overflow: 'hidden'}}>
                                <View style={{width: '100%', paddingHorizontal: 30, paddingVertical: 15, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 6, backgroundColor: colorGlobal.subBackColor}}>
                                    <Text style={{fontSize: 18, fontWeight: '500', color: colorGlobal.textSecondary}}>Xoá thiết bị</Text>
                                    <Text style={{fontSize: 12, fontWeight: '400', textAlign: 'center', color: colorGlobal.textSecondary}}>Khi bạn xoá, thiết bị sẽ không thể điều khiển qua ứng dụng nhưng điều khiển ở thiết bị vẫn hoạt động và ở chế độ chờ kết nối lại</Text>
                                </View>
                                <Divider style={{width: '100%', height: 1.8, backgroundColor: '#e4e4e7'}}></Divider>
                                <TouchableOpacity
                                    style={{width: '100%', height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colorGlobal.subBackColor}}
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
