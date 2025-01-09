
import React from 'react';
import { Button, FlatList, ImageBackground, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, Vibration, View } from 'react-native';
import { DynamicValuesContext, DimensionsSizeITF, DeviceItemSizeITF } from '@/hooks/context/DynamicValues.context';
import { HouseContext } from '@/hooks/context/HouseData.context';
import HeaderCPN from '@/components/Header';
import variablesGlobal from '@/constants/variables';
import { BlurView } from 'expo-blur';
import IconCPN from '@/components/Icon';
import SwitchDevice from '@/components/devices/Switch';
import imagesGlobal from '@/constants/images';


const variablesInComponent = {
    textPrimary: '#fff',
    textSecondary: '#ccc',
    gapInDeviceList: 14,
    intensityDeviceItemBlur: 70,
}

const Area = ({route}: any) => {

    const { idArea } = route.params || {};

    console.log("Area screen id area " + idArea);


    const { dimensionsSize, deviceItemSize } = React.useContext(DynamicValuesContext) || {
        dimensionsSize: { width: 0, height: 0 } as DimensionsSizeITF,
        deviceItemSize: { width: 0, height: 0 } as DeviceItemSizeITF,
    };

    const { houseDataChosen, areaDataChosen } = React.useContext(HouseContext) || {
        houseDataChosen: {},
        areaDataChosen: {},
    };

    const [scrollY, setScrollY] = React.useState(0);

    console.log(areaDataChosen);


    return (
        <SafeAreaView style={{width: dimensionsSize?.width, height: dimensionsSize?.height}}>
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
                    title={areaDataChosen?.name}
                    scrollY={scrollY}
                    showBackButton={true}
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
                    <Text style={styles.house_name}>{areaDataChosen?.name}</Text>

                    <View style={styles.clusterAreaOfHouse}>
                        <View style={styles.device_container}>
                            {
                                areaDataChosen?.devices?.map((device:any, index:number) => {
                                    return <SwitchDevice key={houseDataChosen.id+"-"+areaDataChosen.id+"-"+device.id} device={device} />
                                })
                            }
                        </View>
                    </View>

                </ScrollView>

            </ImageBackground>
        </SafeAreaView>
    );
};

export default Area;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, width: '100%', height: '100%', zIndex: 0,
    },
    scroll: {
        display: 'flex', flexDirection: 'column', zIndex: 1,
    },
    house_name: {
        marginTop: 15,
        paddingHorizontal: variablesGlobal.marginScreenAppHorizontal,
        fontSize: 30, fontWeight: 'bold', color: '#fff',
    },
    // Device
    clusterAreaOfHouse: {
        marginHorizontal: variablesGlobal.marginScreenAppHorizontal, backgroundColor: 'transparent',
    },
    device_container: {
        marginTop: 15, flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: variablesInComponent.gapInDeviceList,
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

