
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import HeaderCPN from '@/components/Header';
import variablesGlobal from '@/constants/variables';
import { DynamicValuesContext, DimensionsSizeITF, DeviceItemSizeITF } from '@/hooks/context/DynamicValues.context';
import useMyAnimation from '@/hooks/animated/Animation.animated';
import { BlurView } from 'expo-blur';
import IconCPN from '@/components/Icon';
import { HouseContext } from '@/hooks/context/HouseData.context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PaaCard from '@/components/PadCard';
import SwitchDevice from '@/components/devices/Switch';
import imagesGlobal from '@/constants/images';


const variablesInComponent = {
    textPrimary: '#fff',
    textSecondary: '#ccc',
    gapInDeviceList: 14,
    intensityDeviceItemBlur: 70,
}


const Index = () => {

    const navigation = useNavigation();

    const { housesData, houseDataChosen, handleChoosenHouseByID, handleChooseAreaByID } = React.useContext(HouseContext) || {};

    const { dimensionsSize, deviceItemSize } = React.useContext(DynamicValuesContext) || {
        dimensionsSize: { width: 0, height: 0 } as DimensionsSizeITF,
        deviceItemSize: { width: 0, height: 0 } as DeviceItemSizeITF,
    };

    const backgroundOnHeaderAnimation = useMyAnimation({ opacity: 0, translateY: 0, scale: 1, rotate: 0});
    const houseNameOnHeaderAnimation = useMyAnimation({ opacity: 0, translateY: 0, scale: 1, rotate: 0});


    // useEffect(() => {
    //     navigation.navigate( "(auth)", { screen: "logInScreen" } );
    // }, [])

    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        if (scrollY > 20) {
            backgroundOnHeaderAnimation.fadeIn(50);
            houseNameOnHeaderAnimation.fadeIn(200);
        } else {
            backgroundOnHeaderAnimation.fadeOut(50);
            houseNameOnHeaderAnimation.fadeOut(100);
        }
    }, [scrollY]);

    useFocusEffect(
        React.useCallback(() => {
          // Logic của bạn muốn thực thi khi mỗi lần truy cập vào màn hình này
          handleChooseAreaByID && handleChooseAreaByID(0);

          return () => {
            // Logic cleanup nếu cần thiết khi rời khỏi màn hình
          };
        }, [])
    );

    const handleGotoAddDevice = () => {
        navigation.navigate("(devices)", { screen: "addDevice", params: { idHouse: houseDataChosen.id, idArea: null } });
    }


    return (
        <SafeAreaView style={{ width: dimensionsSize?.width, height: dimensionsSize?.height, }}>
            <ImageBackground
                source={
                    houseDataChosen?.setting?.wallpaper_path
                        ? { uri: houseDataChosen?.setting?.wallpaper_path }
                        : imagesGlobal.WallpaperDefault
                }
                resizeMode='cover'
                blurRadius={0.7}
                style={styles.backgroundImage}
            >
                <HeaderCPN
                    title={houseDataChosen?.name || 'Nhà Của Tôi'}
                    scrollY={scrollY}
                ></HeaderCPN>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={(event) => {
                        // Bắt sự kiện scroll và cập nhật giá trị scrollY
                        setScrollY(event.nativeEvent.contentOffset.y);
                    }}
                    scrollEventThrottle={1} // Tần suất gọi sự kiện onScroll
                    style={styles.scroll}
                    stickyHeaderIndices={[]}
                >
                    <View style={styles.clusterAddDevice}>
                        <Text style={styles.house_name}>{houseDataChosen?.name || 'Nhà Của Tôi'}</Text>
                        <BlurView intensity={variablesInComponent.intensityDeviceItemBlur} tint='dark' style={[styles.device_item, styles.device_item_blur, { width: deviceItemSize.width, height: deviceItemSize.height }]}>
                            <TouchableOpacity style={[styles.device_item_content, styles.device_item_add]}
                                onPress={() => handleGotoAddDevice()}
                            >
                                <View style={styles.device_item_addBtn}>
                                    <View style={styles.device_item_addBtn_icon}>
                                        <IconCPN iconName={'plusRegular'} size={18} color={'#fff'}></IconCPN>
                                    </View>
                                </View>
                                <Text style={styles.device_item_name}>Thêm thiết bị</Text>
                            </TouchableOpacity>
                        </BlurView>
                    </View>

                    {
                        houseDataChosen?.areas?.length
                        &&
                        houseDataChosen?.areas?.map((area:any, index:number) => (
                            <View style={styles.clusterAreaOfHouse} key={index}>
                                <Text style={styles.house_areaName}>{area.name}</Text>
                                <View style={styles.device_container}>
                                    {
                                        area?.own_devices?.map((device:any, index:number) => {
                                            let topicSend = houseDataChosen.id +"/"+device.id_device+"/send";
                                            let topicReceive = houseDataChosen.id +"/"+device.id_device+"/receive";
                                            return <SwitchDevice key={houseDataChosen.id+"-"+area.id+"-"+device.id} device={device} topic={{send: topicSend, receive: topicReceive}}/>
                                        })
                                    }
                                </View>
                            </View>
                        ))
                    }

                    <PaaCard width={'100%'} height={100}></PaaCard>

                </ScrollView>
            </ImageBackground>

        </SafeAreaView>
    );

};

export default Index;


const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, width: '100%', height: '100%', zIndex: 0,
    },
    header: {
        position: 'relative', zIndex: 99999,
    },
    header_backgroundImg: {
        width: '100%', height: '100%', overflow: 'hidden',
    },
    header_content: {
        position: 'absolute', bottom: 12, zIndex: 2,
    },
    header_content_title: {
        position: 'absolute', bottom: 12, left: 0, width: '100%', zIndex: 1,
    },
    header_content_title_text: {
        textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'white',
    },
    scroll: {
        // paddingHorizontal: variablesGlobal.marginScreenAppHorizontal,
        display: 'flex', flexDirection: 'column', zIndex: 1,
    },
    house_name: {
        fontSize: 30, fontWeight: 'bold', color: variablesInComponent.textPrimary,
    },
    house_areaName: {
        marginTop: 30, marginBottom: 20, fontSize: 20, fontWeight: '500', color: variablesInComponent.textPrimary
    },
    clusterAddDevice: {
        marginTop: 20, marginHorizontal: variablesGlobal.marginScreenAppHorizontal, backgroundColor: 'transparent',
        flex: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20,
    },
    clusterAreaOfHouse: {
        marginHorizontal: variablesGlobal.marginScreenAppHorizontal, backgroundColor: 'transparent',
    },
    device_container: {
        flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: variablesInComponent.gapInDeviceList,
    },
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
