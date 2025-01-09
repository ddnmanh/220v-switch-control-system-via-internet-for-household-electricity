

import IconCPN from '@/components/Icon';
import variablesGlobal from '@/constants/variables';
import useMyAnimation from '@/hooks/animated/Animation.animated';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-paper';
import {HouseContext} from '@/hooks/context/HouseData.context';
import imagesGlobal from '@/constants/images';

const Setting = () => {

    const navigation = useNavigation();
    const { houseDataChosen } = React.useContext(HouseContext) || { houseDataChosen: {} };

    const houseNameOnHeaderAnimation = useMyAnimation({ opacity: 0, translateY: 0, scale: 1, rotate: 0 });

    const [forcusHouseNameInput, setForcusHouseNameInput] = React.useState(false);
    const [forcusHouseNoteInput, setForcusHouseNoteInput] = React.useState(false);

    const [newHouseName, setNewHouseName] = React.useState(houseDataChosen.name || 'Tên nhà của tôi');
    const [newHouseNote, setNewHouseNote] = React.useState(houseDataChosen.note || '');

    const [scrollY, setScrollY] = React.useState(0);

    return (
        <SafeAreaView style={{backgroundColor: 'transparent', flex: 1}}>
            <View style={[styles.header, { backgroundColor: scrollY>20 ? '#fff' : 'transparent', borderWidth: 1, borderColor:  scrollY>20 ? '#d4d4d8' : 'transparent'}]}>
                <View style={styles.header_container}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate("(house)", { screen: "housemange" })}
                    >
                        <IconCPN iconName='angleLeftRegular' size={18} color='#FB923C'></IconCPN>
                        <Text style={styles.backButton_text}>Quản Lý</Text>
                    </TouchableOpacity>

                    <Animated.View
                        style={[
                            styles.clusterText,
                            { opacity: houseNameOnHeaderAnimation.animationValue.opacity },
                        ]}
                    >
                        <Text style={styles.clusterText_text}>Cài Đặt Nhà</Text>
                    </Animated.View>

                    <View style={styles.buttonBar}>
                        <TouchableOpacity
                            style={[styles.buttonBar_button]}
                            onPress={() => navigation.navigate( "(main)", { screen: "(home)", params: { screen: "index" } } ) }
                        >
                            <Text style={styles.buttonBar_buttonText}>Xong</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            <View style={styles.content}>
                <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    onScroll={(event) => {
                        // Bắt sự kiện scroll và cập nhật giá trị scrollY
                        setScrollY(event.nativeEvent.contentOffset.y);
                    }}
                    scrollEventThrottle={1} // Tần suất gọi sự kiện onScroll
                >
                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>TÊN NHÀ</Text>
                        <View style={styles.clusterInput_boxTextInput}>
                            <TextInput
                                style={styles.clusterInput_boxTextInput_textInput}
                                placeholder='Tên nhà của tôi'
                                placeholderTextColor='#999999'
                                value={newHouseName}
                                onFocus={() => setForcusHouseNameInput(true)}
                                // onBlur={() => setForcusHouseNameInput(false)}
                                onChange={(e) => setNewHouseName(e.nativeEvent.text)}
                            />
                            {
                                forcusHouseNameInput && newHouseName.length > 0
                                &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setNewHouseName('');
                                        setForcusHouseNameInput(false);
                                    }}
                                >
                                    <IconCPN iconName="circleXmarkSolid" color="#c1c1c1"></IconCPN>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <Divider style={{ height: 20, backgroundColor: 'transparent' }}></Divider>

                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>ẢNH NỀN CHÍNH</Text>
                        <View style={styles.clusterInput_box}>
                            <TouchableOpacity style={{paddingVertical: 10, paddingTop: 0}}>
                                <Text style={{ fontFamily: 'SanFranciscoText-SemiBold', color: '#FB923C', fontSize: 15, lineHeight: 18  }}>Chụp Ảnh</Text>
                            </TouchableOpacity>
                            <Divider style={{ height: 1, backgroundColor: '#e4e4e7' }}></Divider>
                            <TouchableOpacity style={[{paddingVertical: 10}, {flex: 1, flexDirection: 'row', alignItems: 'center'}]}>
                                <Text style={{ flex: 1, fontFamily: 'SanFranciscoText-SemiBold', color: '#000', fontSize: 15, }}>Chọn ảnh Có sẳn</Text>
                                <IconCPN iconName="angleLeftRegular" color="#c1c1c1" rotate={180} size={12}></IconCPN>
                            </TouchableOpacity>
                            <Divider style={{ height: 1, backgroundColor: '#e4e4e7' }}></Divider>
                            <View style={{paddingVertical: 10, paddingBottom: 0}}>
                                <Image
                                    source={
                                        houseDataChosen?.setting?.wallpaper_path
                                            ? { uri: houseDataChosen?.setting?.wallpaper_path }
                                            : imagesGlobal.WallpaperDefault
                                    }
                                    resizeMode="contain"
                                    style={{ height: 250, borderRadius: 10 }}
                                />
                            </View>
                        </View>
                    </View>

                    <Divider style={{ height: 20, backgroundColor: 'transparent' }}></Divider>

                    <View style={styles.clusterInput}>
                        <Text style={styles.clusterInput_title}>GHI CHÚ NHÀ</Text>
                        <View style={[styles.clusterInput_boxTextInput, {height: 140}]}>
                            <TextInput
                                style={[styles.clusterInput_boxTextInput_textInput]}
                                placeholder='Thêm ghi chú để bạn nhanh nhớ ngôi nhà của bạn hơn'
                                placeholderTextColor='#999999'
                                value={newHouseNote}
                                onFocus={() => setForcusHouseNoteInput(true)}
                                onBlur={() => setForcusHouseNoteInput(false)}
                                multiline={true}
                                numberOfLines={4}
                                onChange={(e) => setNewHouseNote(e.nativeEvent.text)}
                            />
                        </View>
                    </View>

                    <Divider style={{ height: 40, backgroundColor: 'transparent' }}></Divider>

                    <TouchableOpacity style={styles.clusterInput_box}>
                        <Text style={[styles.clusterInput_box_text, {color: 'red'}]}>Xoá Nhà Này</Text>
                    </TouchableOpacity>

                    <Divider style={{ height: 80, backgroundColor: 'transparent' }}></Divider>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Setting;

const styles = StyleSheet.create({
    header: {
        height: variablesGlobal.heightHeader, flexDirection: 'row', alignItems: 'flex-end', zIndex: 99999, position: 'relative',
    },
    header_container: {
        paddingBottom: 10, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal, flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between', position: 'relative',
    },
    backButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 3, zIndex: 10,
    },
    backButton_text: {
        fontSize: 16, fontFamily: 'SanFranciscoText-SemiBold', color: '#FB923C'
    },
    clusterText: {
        flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 10, // same as paddingBottom of header_container
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
    },
    //
    content: {
        flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, height: '100%'
    },
    scroll: {
        flex: 1, paddingHorizontal: variablesGlobal.marginScreenAppHorizontal, paddingTop: 20
    },
    clusterInput: {
        width: '100%', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', rowGap: 4
    },
    clusterInput_title: {
        fontSize: 12, fontFamily: 'SanFranciscoText-SemiBold', color: '#a1a1aa', marginLeft: 16,
    },
    clusterInput_boxTextInput: {
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 10,
    },
    clusterInput_boxTextInput_textInput: {
        paddingVertical: 0, paddingHorizontal: 0, flex: 1, backgroundColor: 'transparent', fontSize: 15, color: '#000', fontFamily: 'SanFranciscoText-SemiBold',
        height: '100%', textAlign: 'left', textAlignVertical: 'top'
    },
    clusterInput_box: {
        paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 10,
    },
    clusterInput_box_text: {
        fontSize: 15, fontFamily: 'SanFranciscoText-SemiBold', color: '#000', lineHeight: 18,
    },
});

