
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, Keyboard } from 'react-native';
import React, { useContext } from 'react';
import colorGlobal from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import OwnDeviceFetch from '@/fetch/OwnDevice.fetch';
import { HouseContext, HouseContextProps } from '@/hooks/context/HouseData.context';
import variablesGlobal from '@/constants/variables';
import IconCPN from '@/components/Icon';
import { Message } from '@/components/devices/SwitchItem';
import imagesGlobal from '@/constants/images';
import { LinearGradient } from 'expo-linear-gradient';
import { DynamicValuesContext, DynamicValuesContextProps } from '@/hooks/context/DynamicValues.context';
import { useMQTTContext } from '@/hooks/context/MQTT.context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import fontsGlobal from '@/constants/fonts';
import { OwnDeviceINF } from '@/interfaces/House.interface';


const Device = ({route}: any) => {

    const { device } = route.params;

    const navigation = useNavigation();

    const { idRoomSelected, handleUpdateDataOwnDevice } = useContext(HouseContext) as HouseContextProps;

    const {dimensionsSize} = React.useContext(DynamicValuesContext) as DynamicValuesContextProps;

    const [thisOwnDevice, setThisOwnDevice] = React.useState<OwnDeviceINF>(device);

    const [newNameDevice, setNewNameDevice] = React.useState<string>('');

    const [isRenameDevice, setIsRenameDevice] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (thisOwnDevice) handleUpdateDataOwnDevice(thisOwnDevice);
        setNewNameDevice(thisOwnDevice?.name ? thisOwnDevice?.name : '');
    }, [thisOwnDevice]);

    const {
        subscribeTopicMQTT,
        publishToTopicMQTT,
        setOnMessageArrivedFromMQTT,
        removeOnMessageArrivedFromMQTT,
        isMQTTConnected,
    } = useMQTTContext();

    const [idRequire, setIdRequire] = React.useState<string>("");

    const handleControllToEquipment = (type: string = "CONTROLL") => {
        const strTimestamp = new Date().getTime().toString();
        setIdRequire(strTimestamp);
        publishToTopicMQTT(
            thisOwnDevice?.mqtt_topic_send,
            JSON.stringify({
                type: type,
                id: strTimestamp,
                value: !thisOwnDevice?.state,
            })
        );
    };

    React.useEffect(() => {
        const handleMessage = (message: Message) => {
            if (message.destinationName === thisOwnDevice?.mqtt_topic_receive) {
                try {
                    // console.log(
                    //     `Message received on Device Card ${message.destinationName}: ${message.payloadString}`
                    // );

                    const parsedMessage = JSON.parse(message.payloadString);

                    // console.log(
                    //     parsedMessage.id === idRequire,
                    //     " ------------------ ",
                    //     idRequire,
                    //     parsedMessage.id
                    // );

                    if (parsedMessage.type === "NOTI") {
                        setThisOwnDevice((prev) => ({ ...prev, state: parsedMessage.value, online: true }));
                        setIdRequire("");
                    }

                    if (
                        parsedMessage.type === "CONTROLL_RES" &&
                        parsedMessage.id === idRequire
                    ) {
                        setThisOwnDevice((prev) => ({ ...prev, state: parsedMessage.value, online: true }));
                        setIdRequire("");
                    }

                    if (
                        parsedMessage.type === "STATUS_RES" &&
                        parsedMessage.id === idRequire
                    ) {
                        setThisOwnDevice((prev) => ({ ...prev, state: parsedMessage.value, online: true }));
                        setIdRequire("");
                    }
                } catch (error) {
                    console.log("Error parsing message payload", error);
                }
            }
        };

        if (isMQTTConnected) setOnMessageArrivedFromMQTT(handleMessage);

        return () => removeOnMessageArrivedFromMQTT(handleMessage);
    }, [
        thisOwnDevice.mqtt_topic_receive,
        subscribeTopicMQTT,
        setOnMessageArrivedFromMQTT,
        removeOnMessageArrivedFromMQTT,
        idRequire,
    ]);

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleRenameDevice = async () => {

        if (newNameDevice !== thisOwnDevice?.name) {
            try {
                const response = await OwnDeviceFetch.update({id_own_device: thisOwnDevice.id, name: newNameDevice, desc: thisOwnDevice.desc });

                if (response.code == 200) {
                    setThisOwnDevice((prev) => ({ ...prev, name: newNameDevice }));
                }
            } catch (error) {
                console.log(error);
            }
        }
    }


    const [isFocusNameInput, setIsFocusNameInput] = React.useState<boolean>(false);

    const handleOnBlurInputNewNameDevice = () => {
        Keyboard.dismiss();

        if (newNameDevice === thisOwnDevice?.name) {
            setIsFocusNameInput(false);
            setIsRenameDevice(false);
        }
    }

    return (
        <View style={{backgroundColor: '#fff', flex: 1}}>

            <LinearGradient
                // Background Linear Gradient
                colors={['#cffafe', '#fae8ff']}
                locations={[0.3, 0.9]}
                style={{    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: dimensionsSize.height + 40,
                }}
            >

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
                            {
                                isRenameDevice
                                &&
                                <TextInput
                                    style={[styles.headerClusterTittle_text, {color: "#ccc"}]}
                                    value={newNameDevice}
                                    onChange={(e) => setNewNameDevice(e.nativeEvent.text)}
                                    autoFocus={true}
                                />
                                ||
                                <Text style={[styles.headerClusterTittle_text, {color: "#000"}]}>{newNameDevice}</Text>
                            }
                        </View>

                        <View style={[styles.buttonBarRight]}>
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => {
                                    if (!isRenameDevice) {
                                        setIsRenameDevice(true);
                                        setIsFocusNameInput(true);
                                    } else {
                                        setIsRenameDevice(false);
                                        handleRenameDevice();
                                    }
                                }}
                            >
                                <Text style={styles.headerButton_text}>{isRenameDevice ? 'Xong' : 'Sửa'}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

                <TouchableWithoutFeedback onPress={() => handleOnBlurInputNewNameDevice() } style={{width: dimensionsSize.width, height: dimensionsSize.height}}>
                    <View style={{width: '100%', height: '100%', backgroundColor: 'transparent'}}>

                        <View  style={{width: '100%', height: dimensionsSize.height - 48 - 100 , backgroundColor: 'transparent', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 46}}>
                            <LinearGradient
                                colors={[thisOwnDevice?.state ? '#e879f9' : "#a3a3a3", thisOwnDevice?.state ? '#4c1d95' : "#525252"]}
                                locations={[0.1, 0.9]}
                                style={[{width: 220, height: 220, borderRadius: 220, justifyContent: 'center', alignItems: 'center'}, {borderWidth: 0, borderColor: '#16a34a'}]}
                            >
                                <TouchableOpacity style={[{width: 220 - 20, height: 220 - 20, justifyContent: 'center', alignItems: 'center'}]} activeOpacity={0.8}
                                    onPress={() => handleControllToEquipment("CONTROLL")}
                                >
                                    <Image source={imagesGlobal.deviceSwitchButton} style={{width: 220 -20, height: 220 -20, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </LinearGradient>
                            <Text style={{textAlign: 'center', fontSize: 18, color: colorGlobal.textSecondary}}>{thisOwnDevice?.state ? "Bật" : "Tắt"} Nguồn</Text>
                        </View>

                        <View style={{width: '100%', height: 100, paddingTop: 0, paddingHorizontal: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', rowGap: 46}}>

                            <TouchableOpacity activeOpacity={0.8} style={{width: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 3}}
                                onPress={() => handleControllToEquipment("CONTROLL")}
                            >
                                <View style={{padding: 15, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: thisOwnDevice?.state ? "#7c3aed" : "#e9d5ff" }}>
                                    <IconCPN iconName='powerOffRegular' size={18} color={colorGlobal.textSecondary}></IconCPN>
                                </View>
                                <Text style={{fontSize: 10, fontFamily: 'SanFranciscoText-SemiBold', color: colorGlobal.textSecondary}}>{thisOwnDevice?.state ? "Bật" : "Tắt"}</Text>
                            </TouchableOpacity >

                            <TouchableOpacity activeOpacity={0.8} style={{width: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 3 }}>
                                <View style={{padding: 15, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9d5ff' }}>
                                    <IconCPN iconName='badgeCheckSolid' size={18} color={colorGlobal.textSecondary}></IconCPN>
                                </View>
                                <Text style={{fontSize: 10, fontFamily: 'SanFranciscoText-SemiBold', color: colorGlobal.textSecondary}}>Tự động</Text>
                            </TouchableOpacity >

                            <TouchableOpacity activeOpacity={0.8} style={{width: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 3 }}
                                onPress={() => navigation.navigate('settingDeviceScreen', {device: thisOwnDevice, idRoom: idRoomSelected })}
                            >
                                <View style={{padding: 15, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9d5ff' }}>
                                    <IconCPN iconName='gearSolid' size={18} color={colorGlobal.textSecondary}></IconCPN>
                                </View>
                                <Text style={{fontSize: 10, fontFamily: 'SanFranciscoText-SemiBold', color: colorGlobal.textSecondary}}>Cài đặt</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </LinearGradient>

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
});

export default Device;
