
import { Text, View, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { Link } from 'expo-router';
import ButtonCPN from '@/components/Button';
import InputCPN from '@/components/Input';
import colorGlobal from '@/constants/colors';
import WifiManager from 'react-native-wifi-reborn';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '@/hooks/context/Auth.context';
import { BlurView } from 'expo-blur';
import { WifiContext } from '@/hooks/context/Wifi.context';
import { HouseContext } from '@/hooks/context/HouseData.context';


const AddDevice = ({route}: any) => {

    const { idHouse, idArea } = route.params || {};

    const { handleAddHouse } = useContext(HouseContext) || {};

    const navigation = useNavigation();
    const { userInfo } = React.useContext(AuthContext) || {};
    const { wifiInfomation } = useContext(WifiContext) || {};

    const [deviceID, setDeviceID] = React.useState('');
    const [houseSSID, setHouseSSID] = React.useState('Viettel');
    const [passwordHouseSSID, setPasswordHouseSSID] = React.useState('newday23');

    const [isSettingUp, setIsSettingUp] = React.useState(false);

    const [isCoverInputDevice, setIsCoverInputDevice] = React.useState(false);
    const [isDisableButton, setIsDisableButton] = React.useState(false);
    const [gmt, setGmt] = React.useState(7);


    React.useEffect(() => {
        handleCheckWifi();
        setGmt(getGMT());
        handleGetDeviceIdFromSSID();
    }, [wifiInfomation, userInfo]);

    const handleCheckWifi = async () => {
        // Connected to wifi and can access internet
        if (wifiInfomation && wifiInfomation.isInternetReachable) {

            // 5GHz wifi
            if (wifiInfomation.details?.frequency > 3000) {
                setIsCoverInputDevice(true);
                setIsDisableButton(true);
            }
        }

        // Connected to wifi but can't access internet
        if (wifiInfomation && !wifiInfomation.isInternetReachable) {
            setIsCoverInputDevice(true);
            setIsDisableButton(false);


            // Get device ID from wifi ssid
            setDeviceID(() => {
                let ssid = wifiInfomation.details?.ssid || '';
                return ssid.split('_')[0];
            })
        }

        // Not connected to wifi
        if (!wifiInfomation) {
            setIsDisableButton(true);
        }
    }

    const getGMT = () => {
        const offsetMinutes = new Date().getTimezoneOffset(); // Lấy offset tính bằng phút
        const offsetHours = -offsetMinutes / 60; // Chuyển thành giờ, đổi dấu để tính chênh lệch đúng
        return offsetHours;
    };

    const disconnectFromWifi = async () => {
        try {
            await WifiManager.disconnect();
        } catch (error) {
            console.log('Error disconnecting from WiFi:', error);
        }
    };

    const handleFetchToDevice = async () => {
        setIsSettingUp(true);

        try {

            const response = await fetch(`http://192.168.4.1/setWiFi?ownerId=${idHouse}&gmt=${gmt}&ssid=${houseSSID}&password=${passwordHouseSSID}`);

            if (response.status === 200 || response.status === 201) {
                console.log('Setup successful, reconnecting to previous WiFi...');
                await disconnectFromWifi();

                setTimeout(async () => {
                    handleGoToSetupOwnDeviceScreen();
                }, 5000);

            } else {
                console.log('Setup failed with status:', response.status);
            }

        } catch (error) {
            console.log('Error while connecting to ESP-WIFI:', error);
        }
    };

    const handleGetDeviceIdFromSSID = () => {
        setDeviceID(() => {
            return wifiInfomation?.details?.ssid || '';
        })
    }

    const handleGoToSetupOwnDeviceScreen = () => {
        navigation.navigate( "(devices)", { screen: "setupNewOwnDeviceScreen", params: { idDevice: deviceID }} )
    }

    return (
        <View style={styles.container}>
            <View style={styles.viewInput}>
                <Text style={styles.viewInput_title}>Thêm Thiết Bị</Text>

                <View
                    style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: colorGlobal.borderLine,
                        marginTop: 20,
                    }}
                ></View>
                <Text style={{marginVertical: 10, color: colorGlobal.textDesc, fontSize: 14, textAlign: 'center'}}>
                    Kết nối vào wifi của thiết bị để tiếp tục
                </Text>
                <View
                    style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: colorGlobal.borderLine,
                        marginBottom: 20,
                    }}
                ></View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <InputCPN label="" placeholder="Wifi" value={houseSSID} onChange={(text) => setHouseSSID(text)}></InputCPN>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <InputCPN label="" type='password' placeholder="Mật khẩu" value={passwordHouseSSID} onChange={(text) => setPasswordHouseSSID(text)}></InputCPN>
                </View>

                <View>
                    <ButtonCPN content='KẾT NỐI' type='primary' handlePress={() => handleFetchToDevice()} disable={isDisableButton || isSettingUp} isLoading={isSettingUp}/>
                    <ButtonCPN content='TEST' type='primary' handlePress={() => handleGoToSetupOwnDeviceScreen()} disable={false} />
                    <View style={styles.viewLink_linkBar}>
                        <Link href="sign-up" style={styles.viewLink_linkBar_link}>Hướng dẫn, </Link>
                        <Link href="forgot-password" style={styles.viewLink_linkBar_link}>Tìm hiểu thêm.</Link>
                    </View>
                </View>
            </View>


            <View style={styles.ortherMethodView}>
                <View>
                    <Text style={styles.ortherMethodView_commitText}>
                        Chúng tôi đảm bảo an toàn cho các thông tin của bạn cung cấp theo chính sách pháp luật quốc gia của bạn!
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingTop: 130,
        paddingHorizontal: 20,
        backgroundColor: colorGlobal.backColor,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        rowGap: 50,
    },
    viewInput: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        rowGap: 5,
    },
    viewInput_title: {
        textAlign: 'center',
        fontSize: 28,
    },
    viewLink_line: {
        marginVertical: 28,
        borderTopWidth: 1,
        borderTopColor: colorGlobal.borderLine,
        position: 'relative',
    },
    viewLink_line_title: {
        position: 'absolute',
        top: -7, // -(lineHeight / 2)
        left: '50%',
        transform: [{ translateX: -54 }], // (width text + paddingHorizontal) /2
        paddingHorizontal: 8,
        backgroundColor: colorGlobal.backColor,
        color: colorGlobal.textDesc,
        fontSize: 14,
        lineHeight: 14,
    },
    viewLink_linkBar: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    viewLink_linkBar_link: {
        color: colorGlobal.textLink,
        fontSize: 16,
    },
    ortherMethodView: {
        flexDirection: 'column',
        alignItems: 'stretch',
        rowGap: 18,
    },
    ortherMethodView_commitText: {
        color: colorGlobal.textDesc,
        fontSize: 12,
        textAlign: 'center',
    },
    ortherMethodView_trademark: {
        marginTop: 20,
        marginBottom: 25,
        color: colorGlobal.textDesc,
        fontSize: 14,
        textAlign: 'center',

    }
});

export default AddDevice;
