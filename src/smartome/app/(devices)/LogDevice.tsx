
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
import HistoryOperationDeviceFetch from '@/fetch/HistoryOperationDevice.fetch';

type Event = {
    time: {
        hour: number;
        mins: number;
    };
    value: {
        state: number;
    };
};

type GroupedData = {
    date: {
        day: number;
        month: number;
        year: number;
    };
    event: Event[];
};

type HistoryOperationDeviceITF = {
    id: number;
    id_house: string;
    id_device: string;
    state: number;
    event_date_time: string;
};


const LogDevice = ({ route }: any) => {

    const { device } = route.params;

    const navigation = useNavigation();

    const { idHouseSelected } = useContext(HouseContext) as HouseContextProps;

    const [thisOwnDevice, setThisOwnDevice] = React.useState<OwnDeviceINF>(device);

    const [historyOperationDevice, setHistoryOperationDevice] = React.useState<any[]>([]);

    const [scrollY, setScrollY] = React.useState(0);

    const handleBackButton = () => {
        navigation.goBack();
    };

    React.useEffect(() => {
        handleGetHistoryOperationDevice();
    }, [device]);

    const handleGetHistoryOperationDevice = async () => {
        try {
            let response = await HistoryOperationDeviceFetch.get({ house_id: idHouseSelected, device_id: thisOwnDevice.id_device });

            if (response.code === 200) {
                if (response.data.length > 0) {
                    setHistoryOperationDevice(groupDataByDate(response.data));
                }
            }

        } catch (error) {
            console.log('Error handleGetHistoryOperationDevice: ', error);
        }
    };


    const groupDataByDate = (data: HistoryOperationDeviceITF[]): GroupedData[] => {
        const groupedData: { [key: string]: GroupedData } = {};

        data.forEach((item) => {
            const utcDate = new Date(item.event_date_time);

            // Chuyển sang múi giờ GMT+7
            const gmt7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

            // Lấy giá trị ngày, tháng, năm, giờ, phút và thêm "0" phía trước nếu cần
            const day = gmt7Date.getUTCDate().toString().padStart(2, "0");
            const month = (gmt7Date.getUTCMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
            const year = gmt7Date.getUTCFullYear().toString();
            const hour = gmt7Date.getUTCHours().toString().padStart(2, "0");
            const mins = gmt7Date.getUTCMinutes().toString().padStart(2, "0");

            const dateKey = `${year}-${month}-${day}`;

            if (!groupedData[dateKey]) {
                groupedData[dateKey] = {
                    date: { day, month, year },
                    event: [],
                };
            }

            groupedData[dateKey].event.push({
                time: { hour, mins },
                value: { state: item.state },
            });
        });

        return Object.values(groupedData);
    };

    return (
        <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>

                <View style={[styles.header, scrollY < 15 ? {backgroundColor: 'transparent', borderBottomColor: 'transparent'} : {} ]}>
                    <View style={[styles.header_container, { alignItems: 'center', justifyContent: 'space-between' }]}>
                        <TouchableOpacity
                            style={[styles.headerButton]}
                            onPress={() => handleBackButton()}
                        >
                            <IconCPN iconName='angleLeftRegular' size={18} color='#FB923C'></IconCPN>
                            {/* Không có nội dung vẫn giữ Text để không bị vỡ layout */}
                            <Text style={[styles.headerButton_text]}></Text>
                        </TouchableOpacity>

                        <View style={[styles.headerClusterTittle]}>
                            <Text style={[styles.headerClusterTittle_text, { color: "#000" }]}>Lịch sử thiết bị hoạt động</Text>
                        </View>

                        {/* Không có nội dung vẫn giữ Text để không bị vỡ layout */}
                        <View style={[styles.buttonBarRight]}>
                            <TouchableOpacity
                                style={[styles.headerButton]}
                                onPress={() => { }}
                            >
                                <Text style={styles.headerButton_text}></Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

                <ScrollView
                    style={{ width: '100%', height: '100%', paddingTop: 20, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal, backgroundColor: colorGlobal.subBackColor, flexDirection: 'column', rowGap: 10 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        rowGap: 16
                    }}
                    onScroll={(event) => {
                        // Bắt sự kiện scroll và cập nhật giá trị scrollY
                        setScrollY(event.nativeEvent.contentOffset.y);
                    }}
                >

                    {
                        historyOperationDevice.map((byDate, index) => {

                            return (
                                <View key={index} style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch', overflow: 'hidden' }}>
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
                                        {byDate.date.day} Tháng {byDate.date.month}, {byDate.date.year}
                                    </Text>
                                    <Divider style={{ height: 1, backgroundColor: '#e4e4e7' }}></Divider>
                                    {
                                        byDate.event.map((event: any, index: number) => {
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        paddingTop: 20,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Text style={{
                                                        width: 60,
                                                        fontSize: 15,
                                                        fontWeight: '400',
                                                        lineHeight: 18,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {event.time.hour}:{event.time.mins}
                                                    </Text>
                                                    <Text style={{
                                                        fontSize: 15,
                                                        fontWeight: '400',
                                                        lineHeight: 18,
                                                        flex: 1,          // Chiếm tối đa không gian có thể
                                                        flexShrink: 1,    // Co lại nếu không đủ không gian
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        textAlign: 'left',
                                                    }}>
                                                        {event.value.state ? 'Mở' : 'Tắt'} nguồn
                                                    </Text>
                                                    <IconCPN iconName='circleSolid' size={8} color={event.value.state ? colorGlobal.onPower : colorGlobal.offPower}></IconCPN>
                                                </View>
                                            )
                                        })
                                    }

                                </View>
                            )
                        })
                    }

                    <Divider style={{ height: 30, backgroundColor: 'transparent' }}></Divider>

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
