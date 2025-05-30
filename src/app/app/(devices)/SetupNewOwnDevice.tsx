
import { Text, View, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import ButtonCPN from '@/components/Button';
import InputCPN from '@/components/Input';
import colorGlobal from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import OwnDeviceFetch from '@/fetch/OwnDevice.fetch';
import { HouseContext, HouseContextProps } from '@/hooks/context/HouseData.context';
import SelectOptionCPN from '@/components/SelectOption';
import TextAreaCPN from '@/components/TextArea';


const SetupNewOwnDevice = ({route}: any) => {

    const { idDevice } = route.params;

    const navigation = useNavigation();

    const { houseDataSelected, roomDataSelected, reloadHouseContext } = useContext(HouseContext) as HouseContextProps;

    const [selectIdRoom, setSelectIdRoom] = React.useState(roomDataSelected?.id || '');
    const [isSelectError, setSelectError] = React.useState(false);
    const [listRoomSelect, setListRoomSelect] = React.useState([]) as any;

    const [nameDevice, setNameDevice] = React.useState('');
    const [descDevice, setDescDevice] = React.useState('');

    const [isSettingUp, setSettingUp] = React.useState(false);

    React.useEffect(() => {
        if (!houseDataSelected) return;

        if (houseDataSelected.rooms?.length > 0) {
            const listRoom = houseDataSelected.rooms.map((room: any) => ({
                label: room.name,
                value: room.id
            }));

            setListRoomSelect([...listRoom, { label: "Thuộc trực tiếp nhà", value: "NO"}]);
        }
    }, [houseDataSelected]);

    const handleSetupDevice = async () => {
        setSettingUp(true);

        let data: {
            id_house: string | undefined,
            id_room?: string | null,
            id_device: string,
            name: string,
            description: string
        } = {
            id_house: houseDataSelected?.id,
            id_room: (selectIdRoom === '' || selectIdRoom === 'NO') ? null : selectIdRoom,
            id_device: idDevice,
            name: nameDevice,
            description: descDevice
        }

        try {
            let response = await OwnDeviceFetch.create(data);


            if (response.status === 200 || response.status === 201) {

                reloadHouseContext();

                setTimeout(() => {
                    setSettingUp(false);
                    navigation.navigate( "(main)", { screen: "(home)", params: { screen: "indexScreen" } });
                }, 2000);
            }

        } catch (error:any) {
            console.log('error', error.response.data);
        }
    }



    return (
        <View style={styles.container}>
            <View style={styles.viewInput}>
                <Text style={styles.viewInput_title}>Cấu Hình Công Tắc Mới</Text>

                <View style={{height: 40}}></View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <SelectOptionCPN
                        label=""
                        caption='Chọn phòng'
                        options={listRoomSelect}
                        // options={options}
                        value={selectIdRoom}
                        onChange={(value) => setSelectIdRoom(value)}
                        errorMessage={isSelectError ? 'Lựa chọn không hợp lệ' : ''}
                    />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <InputCPN label="" placeholder="Tên công tắc" value={nameDevice} onChange={(text) => setNameDevice(text)}></InputCPN>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TextAreaCPN label="" placeholder="Mô tả cho công tắc này" value={descDevice} onChange={(text) => setDescDevice(text)} maxLength={150}></TextAreaCPN>
                </View>

                <View>
                    <ButtonCPN content='Cấu hình' type='primary' handlePress={() => handleSetupDevice()} disable={isSettingUp} isLoading={isSettingUp}/>
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
        paddingTop: 120,
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

export default SetupNewOwnDevice;
