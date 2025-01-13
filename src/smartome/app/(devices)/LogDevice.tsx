
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import colorGlobal from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import { HouseContext, HouseContextProps } from '@/hooks/context/HouseData.context';
import variablesGlobal from '@/constants/variables';
import IconCPN from '@/components/Icon';
import { Divider } from 'react-native-paper';
import fontsGlobal from '@/constants/fonts';
import { OwnDeviceINF } from '@/interfaces/House.interface';


const LogDevice = ({route}: any) => {

    const { device } = route.params;

    const navigation = useNavigation();

    const { handleUpdateDataOwnDevice } = useContext(HouseContext) as HouseContextProps;


    const [thisOwnDevice, setThisOwnDevice] = React.useState<OwnDeviceINF>(device);


    React.useEffect(() => {
        handleUpdateDataOwnDevice(thisOwnDevice);
    }, [thisOwnDevice]);


    const handleBackButton = () => {
        navigation.goBack();
    };

    return (
        <View style={{backgroundColor: '#fff', flex: 1}}>
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
                            <Text style={[styles.headerClusterTittle_text, {color: "#000"}]}>Lịch sử thiết bị hoạt động</Text>
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

export default LogDevice;
