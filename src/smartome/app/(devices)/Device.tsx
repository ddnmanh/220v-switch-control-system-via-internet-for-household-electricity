
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image, TouchableHighlight } from 'react-native';
import React, { useContext } from 'react';
import ButtonCPN from '@/components/Button';
import InputCPN from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import colorGlobal from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import OwnDeviceFetch from '@/fetch/OwnDevice.fetch';
import { HouseContext, HouseContextProps } from '@/hooks/context/HouseData.context';
import SelectOptionCPN from '@/components/SelectOption';
import TextAreaCPN from '@/components/TextArea';
import variablesGlobal from '@/constants/variables';
import IconCPN from '@/components/Icon';
import useMyAnimation from '@/hooks/animated/Animation.animated';
import { Message, SwitchDeviceITF } from '@/components/devices/SwitchItem';
import imagesGlobal from '@/constants/images';
import { LinearGradient } from 'expo-linear-gradient';
import { DynamicValuesContext, DynamicValuesContextProps } from '@/hooks/context/DynamicValues.context';
import { useMQTTContext } from '@/hooks/context/MQTT.context';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';


const Device = ({route}: any) => {

    const { idArea, device, topic } = route.params;

    const navigation = useNavigation();

    const { handleUpdateDataSwitchDevice } = useContext(HouseContext) as HouseContextProps;

    const {dimensionsSize} = React.useContext(DynamicValuesContext) as DynamicValuesContextProps;

    const [thisDevice, setThisDevice] = React.useState<SwitchDeviceITF>(device);

    const [newNameDevice, setNewNameDevice] = React.useState<string>('');

    const [isRenameDevice, setIsRenameDevice] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (thisDevice) handleUpdateDataSwitchDevice(thisDevice.id_device, thisDevice?.state, thisDevice.online, thisDevice?.name);
        setNewNameDevice(thisDevice?.name ? thisDevice?.name : '');
    }, [thisDevice]);

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
            topic.receive,
            JSON.stringify({
                type: type,
                id: strTimestamp,
                value: !thisDevice?.state,
            })
        );
    };

    React.useEffect(() => {
        const handleMessage = (message: Message) => {
            if (message.destinationName === topic.send) {
                try {
                    console.log(
                        `Message received on Device Card ${message.destinationName}: ${message.payloadString}`
                    );

                    const parsedMessage = JSON.parse(message.payloadString);

                    console.log(
                        parsedMessage.id === idRequire,
                        " ------------------ ",
                        idRequire,
                        parsedMessage.id
                    );

                    if (parsedMessage.type === "NOTI") {
                        setThisDevice((prev) => ({ ...prev, state: parsedMessage.value, online: true }));
                        setIdRequire("");
                    }

                    if (
                        parsedMessage.type === "CONTROLL_RES" &&
                        parsedMessage.id === idRequire
                    ) {
                        setThisDevice((prev) => ({ ...prev, state: parsedMessage.value, online: true }));
                        setIdRequire("");
                    }

                    if (
                        parsedMessage.type === "STATUS_RES" &&
                        parsedMessage.id === idRequire
                    ) {
                        setThisDevice((prev) => ({ ...prev, state: parsedMessage.value, online: true }));
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
        topic,
        subscribeTopicMQTT,
        setOnMessageArrivedFromMQTT,
        removeOnMessageArrivedFromMQTT,
        idRequire,
    ]);

    const handleBackButton = () => {
        navigation.goBack();
    };

    const handleRenameDevice = async () => {

        if (newNameDevice !== thisDevice?.name) {
            try {
                const response = await OwnDeviceFetch.update({id_device: thisDevice.id_device, name: newNameDevice, desc: thisDevice.desc });

                if (response.code == 200) {
                    setThisDevice((prev) => ({ ...prev, name: newNameDevice }));
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    console.log(newNameDevice);


    return (
        <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} edges={['right', 'left', 'bottom', 'top']}>

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
                <View style={[styles.header]}>
                    <View style={[styles.header_container, { alignItems: 'center', justifyContent: 'center' }]}>

                        <TouchableOpacity
                            style={[styles.backButton]}
                            onPress={() => handleBackButton()}

                        >
                            <IconCPN iconName='angleLeftRegular' size={18} color='#FB923C'></IconCPN>
                        </TouchableOpacity>

                        <View
                            style={[
                                styles.clusterText
                            ]}
                        >
                            {
                                isRenameDevice
                                &&
                                <TextInput style={[styles.clusterText_text, {color: "#000"}]} value={newNameDevice} onChangeText={(text: string) => setNewNameDevice(text)} autoFocus={true}></TextInput>
                                ||
                                <Text style={[styles.clusterText_text, {color: "#000"}]}>{newNameDevice}</Text>
                            }
                        </View>

                        <View style={styles.buttonBar}>
                            <TouchableOpacity
                                style={[styles.buttonBar_button]}
                                onPress={() => {
                                    if (!isRenameDevice) {
                                        setIsRenameDevice(true);
                                    } else {
                                        setIsRenameDevice(false);
                                        handleRenameDevice();
                                    }
                                }}
                            >
                                <Text style={styles.buttonBar_buttonText}>{isRenameDevice ? 'Xong' : 'Sửa'}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

                <View style={{width: dimensionsSize.width, height: dimensionsSize.height, backgroundColor: 'transparent'}}>

                    <View  style={{width: '100%', height: dimensionsSize.height - 48 - 100 , backgroundColor: 'transparent', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 46}}>
                        <LinearGradient
                            colors={[thisDevice?.state ? '#e879f9' : "#a3a3a3", thisDevice?.state ? '#4c1d95' : "#525252"]}
                            locations={[0.1, 0.9]}
                            style={[{width: 220, height: 220, borderRadius: 220, justifyContent: 'center', alignItems: 'center'}, {borderWidth: 0, borderColor: '#16a34a'}]}
                        >
                            <TouchableOpacity style={[{width: 220 - 25, height: 220 - 25, justifyContent: 'center', alignItems: 'center'}]} activeOpacity={0.8}
                                onPress={() => handleControllToEquipment("CONTROLL")}
                            >
                                <Image source={imagesGlobal.deviceSwitchButton} style={{width: 220 -25, height: 220 -25, resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </LinearGradient>
                        <Text style={{textAlign: 'center', fontSize: 18, color: colorGlobal.textSecondary}}>{thisDevice?.state ? "Bật" : "Tắt"} Nguồn</Text>
                    </View>

                    <View style={{width: '100%', height: 100, paddingTop: 0, paddingHorizontal: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', rowGap: 46}}>

                        <TouchableOpacity activeOpacity={0.8} style={{width: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 3}}
                            onPress={() => handleControllToEquipment("CONTROLL")}
                        >
                            <View style={{padding: 15, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: thisDevice?.state ? "#7c3aed" : "#e9d5ff" }}>
                                <IconCPN iconName='powerOffRegular' size={18} color={colorGlobal.textSecondary}></IconCPN>
                            </View>
                            <Text style={{fontSize: 10, fontFamily: 'SanFranciscoText-SemiBold', color: colorGlobal.textSecondary}}>{thisDevice?.state ? "Bật" : "Tắt"}</Text>
                        </TouchableOpacity >

                        <TouchableOpacity activeOpacity={0.8} style={{width: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 3 }}>
                            <View style={{padding: 15, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9d5ff' }}>
                                <IconCPN iconName='badgeCheckSolid' size={18} color={colorGlobal.textSecondary}></IconCPN>
                            </View>
                            <Text style={{fontSize: 10, fontFamily: 'SanFranciscoText-SemiBold', color: colorGlobal.textSecondary}}>Tự động</Text>
                        </TouchableOpacity >

                        <TouchableOpacity activeOpacity={0.8} style={{width: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 3 }}
                            onPress={() => navigation.navigate('settingDeviceScreen', {device: thisDevice, topic: topic})}
                        >
                            <View style={{padding: 15, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9d5ff' }}>
                                <IconCPN iconName='gearSolid' size={18} color={colorGlobal.textSecondary}></IconCPN>
                            </View>
                            <Text style={{fontSize: 10, fontFamily: 'SanFranciscoText-SemiBold', color: colorGlobal.textSecondary}}>Cài đặt</Text>
                        </TouchableOpacity >
                    </View>
                </View>
            </LinearGradient>

        </SafeAreaView>
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
    }
});

export default Device;
