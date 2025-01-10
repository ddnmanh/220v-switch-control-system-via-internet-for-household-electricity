
import { Text, View, StyleSheet, TouchableOpacity, Animated, Image, TouchableHighlight, ScrollView } from 'react-native';
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
import { Divider } from 'react-native-paper';


const LogDevice = ({route}: any) => {

    const { idArea, device, topic } = route.params;

    const navigation = useNavigation();

    const { handleUpdateDataSwitchDevice } = useContext(HouseContext) as HouseContextProps;

    const {dimensionsSize} = React.useContext(DynamicValuesContext) as DynamicValuesContextProps;

    const [thisDevice, setThisDevice] = React.useState<SwitchDeviceITF>(device);

    const [newNameDevice, setNewNameDevice] = React.useState<string>('');

    const [isRenameDevice, setIsRenameDevice] = React.useState<boolean>(false);

    React.useEffect(() => {
        handleUpdateDataSwitchDevice(thisDevice.id_device, thisDevice?.state, thisDevice.online, newNameDevice);
    }, [thisDevice]);


    const handleBackButton = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{backgroundColor: '#fff', flex: 1}} edges={['right', 'left', 'bottom', 'top']}>
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
                            <Text style={[styles.clusterText_text, {color: "#000"}]}>Lịch sử thiết bị</Text>
                        </View>

                        <View style={styles.buttonBar}></View>
                    </View>
                </View>

                <ScrollView
                    style={{width: '100%', height: '100%', paddingTop: 20, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal, backgroundColor: colorGlobal.subBackColor, flexDirection: 'column', rowGap: 10}}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        rowGap: 16
                  }}
                >

                    <View style={{paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch', overflow: 'hidden'}}>
                        <Text
                            style={{
                                paddingBottom: 10,
                                fontSize: 15,
                                fontWeight: '500',
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis' // Thêm dấu "..." nếu text bị cắt bớt
                            }}
                        >
                            Tháng 12, 2024
                        </Text>

                        <Divider style={{ height: 1, backgroundColor: '#e4e4e7' }}></Divider>

                        <View
                            style={{
                                paddingTop: 20,
                                // backgroundColor: 'red',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{
                                width: 50,
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>23:46</Text>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'left',
                            }}>Công tắc đóng</Text>
                            <IconCPN iconName='circleSolid' size={8} color={colorGlobal.onPower}></IconCPN>
                        </View>


                        <View
                            style={{
                                paddingTop: 20,
                                // backgroundColor: 'red',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{
                                width: 50,
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>22:39</Text>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'left',
                            }}>Công tắc mở</Text>
                            <IconCPN iconName='circleSolid' size={8} color={colorGlobal.offPower}></IconCPN>
                        </View>



                    </View>

                    <View style={{paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch', overflow: 'hidden'}}>
                        <Text
                            style={{
                                paddingBottom: 10,
                                fontSize: 15,
                                fontWeight: '500',
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis' // Thêm dấu "..." nếu text bị cắt bớt
                            }}
                        >
                            Tháng 12, 2024
                        </Text>

                        <Divider style={{ height: 1, backgroundColor: '#e4e4e7' }}></Divider>

                        <View
                            style={{
                                paddingTop: 20,
                                // backgroundColor: 'red',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{
                                width: 50,
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>23:46</Text>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'left',
                            }}>Công tắc đóng</Text>
                            <IconCPN iconName='circleSolid' size={8} color={colorGlobal.onPower}></IconCPN>
                        </View>


                        <View
                            style={{
                                paddingTop: 20,
                                // backgroundColor: 'red',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{
                                width: 50,
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>22:39</Text>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: '400',
                                lineHeight: 18,
                                flex: 1,          // Chiếm tối đa không gian có thể
                                flexShrink: 1,    // Co lại nếu không đủ không gian
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'left',
                            }}>Công tắc mở</Text>
                            <IconCPN iconName='circleSolid' size={8} color={colorGlobal.offPower}></IconCPN>
                        </View>



                    </View>

                </ScrollView>
            </View>
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

export default LogDevice;
