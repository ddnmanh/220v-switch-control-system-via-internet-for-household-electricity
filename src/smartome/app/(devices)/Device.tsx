
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


const Device = ({route}: any) => {

    const { idArea, device, topic, updateDataForRoot } = route.params;

    const navigation = useNavigation();

    const {dimensionsSize} = React.useContext(DynamicValuesContext) as DynamicValuesContextProps;

    const [thisDevice, setThisDevice] = React.useState<SwitchDeviceITF>(device);


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
                value: !thisDevice.state,
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
        updateDataForRoot(thisDevice);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} edges={['right', 'left', 'bottom', 'top']}>

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
                        <Text style={[styles.clusterText_text, {color: "#000"}]}>{thisDevice?.name}</Text>
                    </View>

                    <View style={styles.buttonBar}>
                        <TouchableOpacity
                            style={[styles.buttonBar_button]}
                            onPress={() => {} }
                        >
                            <Text style={styles.buttonBar_buttonText}>Sửa</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>

            <View style={{width: dimensionsSize.width, height: dimensionsSize.height, backgroundColor: '#fff'}}>
                <View  style={{width: '100%', height: 550, backgroundColor: 'transparent', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 46}}>
                    <View style={[{width: 250, height: 250, backgroundColor: thisDevice.state ? '#22c55e' : "#ccc", borderRadius: 250, justifyContent: 'center', alignItems: 'center'}, {borderWidth: 0, borderColor: '#16a34a'}]}>
                        <TouchableOpacity style={[{width: 250 - 25, height: 250 - 25, justifyContent: 'center', alignItems: 'center'}]} activeOpacity={0.8}
                            onPress={() => handleControllToEquipment("CONTROLL")}
                        >
                            <Image source={imagesGlobal.deviceSwitchButton} style={{width: 250 -25, height: 250 -25, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Đang Tắt</Text>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 46, flexDirection: 'row', alignItems: 'flex-end', zIndex: 99999, position: 'relative', backgroundColor: '#fff',
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
