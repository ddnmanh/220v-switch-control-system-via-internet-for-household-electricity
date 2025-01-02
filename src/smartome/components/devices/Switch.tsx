// components/SwitchDevice.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Button, FlatList, ImageBackground, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, Vibration, View } from "react-native";
import { useMQTTContext } from "@/hooks/context/MQTT.context";
import { DynamicValuesContext, DimensionsSizeITF, DeviceItemSizeITF } from '@/hooks/context/DynamicValues.context';
import { HouseContext } from '@/hooks/context/HouseData.context';
import variablesGlobal from '@/constants/variables';
import { BlurView } from 'expo-blur';
import IconCPN from '@/components/Icon';

const variablesInComponent = {
    textPrimary: '#fff',
    textSecondary: '#ccc',
    gapInDeviceList: 14,
    intensityDeviceItemBlur: 70,
}

interface SwitchDevice {
    name: string;
    online: boolean;
    state: boolean;
    topicSend: string;
    topicReceive: string;
}

interface Message {
    destinationName: string;
    payloadString: string;
}

interface SwitchDeviceProps {
    device: SwitchDevice;
}

const SwitchDevice: React.FC<SwitchDeviceProps> = ({ device }) => {
    const {
        subscribeTopicMQTT,
        publishToTopicMQTT,
        setOnMessageArrivedFromMQTT,
        removeOnMessageArrivedFromMQTT,
        isMQTTConnected,
    } = useMQTTContext();

    const [thisDevice, setThisDevice] = useState<SwitchDevice>(device);
    const [idRequire, setIdRequire] = useState<string>("");
    const { deviceItemSize } = React.useContext(DynamicValuesContext) || {
        deviceItemSize: { width: 0, height: 0 } as DeviceItemSizeITF,
    };

    const handleControllToEquipment = useCallback(
        (type: string = "CONTROLL") => {
            const strTimestamp = new Date().getTime().toString();
            setIdRequire(strTimestamp);
            publishToTopicMQTT(
                thisDevice.topicSend,
                JSON.stringify({
                    type: type,
                    id: strTimestamp,
                    value: !thisDevice.state,
                })
            );
        },
        [thisDevice, publishToTopicMQTT]
    );

    useEffect(() => {
        if (isMQTTConnected) subscribeTopicMQTT(thisDevice.topicReceive);
        if (isMQTTConnected) handleControllToEquipment("STATUS");
    }, [isMQTTConnected, subscribeTopicMQTT])

    useEffect(() => {

        const handleMessage = (message: Message) => {
            if (message.destinationName === thisDevice.topicReceive) {
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
        thisDevice.topicReceive,
        subscribeTopicMQTT,
        setOnMessageArrivedFromMQTT,
        removeOnMessageArrivedFromMQTT,
        idRequire,
    ]);


    return (
        <BlurView intensity={70} tint='dark' style={[styles.device_item, styles.device_item_blur, { width: deviceItemSize.width, height: deviceItemSize.height }]}>
            <TouchableNativeFeedback
                onPress={() => {
                    console.log('device', device);
                }}
                onLongPress={() => {
                    console.log('long press');
                    Vibration.vibrate(80);
                }}
            >
                <View style={[styles.device_item_content, styles.device_item_device]} >
                    <View style={styles.device_item_content_top}>
                        <TouchableOpacity
                            style={styles.content_top_icon}
                            onPress={() => isMQTTConnected ? handleControllToEquipment("CONTROLL") : {}}
                        >
                            <IconCPN iconName={thisDevice.state ? 'lightSwitchOnSolid' : 'lightSwitchOffSolid'} size={'100%'} color={thisDevice.state ? '#0ea5e9' : '#a3a3a3'}></IconCPN>
                        </TouchableOpacity>
                        <View style={styles.content_top_right}>
                            <Text style={styles.content_top_nameDevice}>Công tắt</Text>
                            <Text style={[styles.content_top_statusOnline, !thisDevice.online && styles.content_top_statusOnline__offline]}>{thisDevice.online ? 'Online' : 'Offline'}</Text>
                            <Text style={styles.content_top_statusDevice}>{thisDevice.state ? 'Đang đóng' : 'Đang hở'}</Text>
                        </View>
                    </View>
                    <View style={styles.device_item_content_bottom}>
                        <Text style={styles.device_item_name}>{thisDevice.name}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    device_item: {
        borderRadius: 18, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    },
    device_item_blur: {
        backgroundColor: 'rgba(159, 159, 159, 0.7)',
    },
    device_item_blur__on: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    device_item_content: {
        width: '100%', height: '100%', padding: 12,
    },
    device_item_add: {
        flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch'
    },
    device_item_addBtn: {
        flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
    },
    device_item_addBtn_icon: {
        padding: 12, borderRadius: 100, overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    device_item_name: {
        color: '#fff', fontSize: 15, fontWeight: '500',
    },
    device_item_name__on: {
        color: '#262626'
    },
    device_item_device: {
        flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start'
    },
    device_item_content_top: {
        flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', columnGap: 5,
    },
    content_top_icon: {
        width: '42%', aspectRatio: 1/1, padding: 5, alignItems: 'center', justifyContent: 'center',
    },
    content_top_right: {
        flex: 1, justifyContent: 'center', alignItems: 'stretch', flexDirection: 'column', rowGap: 2
    },
    content_top_nameDevice: {
        fontSize: 12, fontWeight: '400', color: '#838383'
    },
    content_top_nameDevice__on: {
        color: '#A9A9A9'
    },
    content_top_statusOnline: {
        fontSize: 12, fontWeight: '500', lineHeight: 13, color: '#66ff66'
    },
    content_top_statusOnline__offline: {
        color: '#ff4d4d'
    },
    content_top_statusDevice: {
        fontSize: 13, fontWeight: '400', lineHeight: 14, color: '#fff'
    },
    content_top_statusDevice__on: {
        color: '#737373'
    },
    device_item_content_bottom: {
        flex: 1, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-end', columnGap: 5,
    },
});

export default SwitchDevice;
