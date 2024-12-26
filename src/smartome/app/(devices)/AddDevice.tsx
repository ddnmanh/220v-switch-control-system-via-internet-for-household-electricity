
import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import ButtonCPN from '@/components/Button';
import InputCPN from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import colorGlobal from '@/constants/colors';
import WifiManager from 'react-native-wifi-reborn';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '@/hooks/context/Auth.context';
import NetInfo from '@react-native-community/netinfo';

const AddDevice = ({route}: any) => {

    const { idHouse, idArea } = route.params || {};
    console.log("Add device screen id house " + idHouse);
    console.log("Add device screen id area " + idArea);

    const navigation = useNavigation();
    const { userInfo } = React.useContext(AuthContext) || {};

    const [deviceSSID, setDeviceSSID] = React.useState('SWITCH_WIFI_');
    const [devicePass, setDevicePass] = React.useState('12345678');
    const [houseSSID, setHouseSSID] = React.useState('labech_dnm');
    const [passwordHouseSSID, setPasswordHouseSSID] = React.useState('techlab@dnmanh');
    const [isSettingUp, setIsSettingUp] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            console.log('Location permission granted', location);
        })();

        const test = async () => {

            WifiManager.getCurrentSignalStrength().then((signalStrength) => {
                console.log('Signal strength:', signalStrength);
            });

            WifiManager.loadWifiList().then((wifiList) => {
                console.log('Wifi list:', wifiList);
            });

            const ssid = await WifiManager.getCurrentWifiSSID();
            console.log('Current WiFi SSID:', ssid);

            NetInfo.fetch().then(state => {
                console.log('Connection type', state.type);
                console.log('Is connected?', state.isConnected);
            });

        }

        test();


    }, []);


    const connectToDeviceWifi = async (ssid: string, password: string) => {
        console.log('Connecting to ESP-WIFI...');
        try {
            await WifiManager.connectToProtectedSSID(ssid, password, false, true);
            console.log('Connected to WiFi');
            console.log(ssid);
        } catch (error) {
            console.log('Error connecting to WiFi');
            console.log(error);
        }
    };

    const disconnectFromWifi = async () => {
        try {
            await WifiManager.disconnect();
        } catch (error) {
            console.log('Error disconnecting from WiFi:', error);

        }
    };

    const handleSetup = async () => {
        setIsSettingUp(true);

        try {
            await connectToDeviceWifi(deviceSSID, devicePass);

            // Đợi một thời gian trước khi tiếp tục
            try {
                console.log('Setting up device...');

                console.log("Before fetch");

                const response = await fetch(`http://192.168.4.1/setWiFi?ownerId=owner-001&gmt=7&ssid=labech_dnm&password=techlab@dnmanh`);
                console.log("Fetch completed:", response);


                setTimeout(async () => {
                    if (response.status === 200) {
                        console.log('Setup successful, reconnecting to previous WiFi...');
                        await disconnectFromWifi();
                        setIsSettingUp(false);

                        handleGoToPrevScreen();
                    } else {
                        console.log('Setup failed with status:', response.status);
                        setIsSettingUp(false);
                    }
                }, 5000);

                } catch (error) {
                    console.log('Error during setup:', error);
                    setIsSettingUp(false);
                }
        } catch (error) {
            console.log('Error while connecting to ESP-WIFI:', error);
        }
    };

    const handleGoToPrevScreen = () => {
        if (idArea === null || idArea === undefined) {
            navigation.navigate( "(main)", { screen: "(home)", params: { screen: "index" } } );
        } else {
            navigation.navigate( "(main)", { screen: "(home)", params: { screen: "area", params: { idArea: idArea } } });
        }
    }


    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom', 'top']}>
            <View style={styles.viewInput}>
                <Text style={styles.viewInput_title}>Thêm Thiết Bị</Text>
                <View
                    style={{
                        width: '100%',
                        padding: 10,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colorGlobal.borderLine,
                        overflow: 'hidden',
                    }}
                >
                    <Text style={{marginBottom: 10}}>Tìm thông tin trên công tắc</Text>
                    <View style={styles.viewInput}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <InputCPN label="" placeholder="SWITCH_xxxx_WIFI" value={deviceSSID} onChange={(text) => setDeviceSSID(text)}></InputCPN>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <InputCPN label="" type='text' placeholder="Mật khẩu công tắc" value={devicePass} onChange={(text) => setDevicePass(text)}></InputCPN>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <InputCPN label="" placeholder="Wifi" value={houseSSID} onChange={(text) => setHouseSSID(text)}></InputCPN>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <InputCPN label="" type='password' placeholder="Mật khẩu" value={passwordHouseSSID} onChange={(text) => setPasswordHouseSSID(text)}></InputCPN>
                </View>

                <View>
                    <ButtonCPN content='KẾT NỐI' type='primary' handlePress={() => handleSetup()} disable={false} isLoading={isSettingUp}/>
                    <View style={styles.viewLink_linkBar}>
                        <Link href="sign-up" style={styles.viewLink_linkBar_link}>Hướng dẫn, </Link>
                        <Link href="forgot-password" style={styles.viewLink_linkBar_link}>Tìm hiểu thêm.</Link>
                    </View>
                </View>
            </View>


            <View style={styles.ortherMethodView}>
                {/* <View style={styles.viewLink_line}>
                    <Text style={styles.viewLink_line_title}>Thông tin thêm</Text>
                </View> */}
                <View>
                    <Text style={styles.ortherMethodView_commitText}>
                        Chúng tôi đảm bảo an toàn cho các thông tin của bạn cung cấp theo chính sách pháp luật quốc gia của bạn!
                    </Text>
                    <Link href='http://smartome.dnmanh.io.vn:65535' style={styles.ortherMethodView_trademark}>smartom.dnmanh.io.vn</Link>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingTop: 80,
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
        rowGap: 18,
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
