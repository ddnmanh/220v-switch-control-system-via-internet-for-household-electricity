

import IconCPN from '@/components/Icon';
import variablesGlobal from '@/constants/variables';
import useMyAnimation from '@/hooks/animated/Animation.animated';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-paper';
import {HouseContext} from '@/hooks/context/HouseData.context';

const Manage = () => {

    const navigation = useNavigation();
    const { houseDataChosen } = React.useContext(HouseContext) || { houseDataChosen: {} };

    const houseNameOnHeaderAnimation = useMyAnimation({ opacity: 0, translateY: 0, scale: 1, rotate: 0 });

    const [forcusHouseNameInput, setForcusHouseNameInput] = React.useState(false);

    const [scrollY, setScrollY] = React.useState(0);

    return (
        <SafeAreaView style={{backgroundColor: 'transparent', flex: 1}}>
            <View style={[styles.header, { backgroundColor: scrollY>20 ? '#fff' : 'transparent', borderWidth: 1, borderColor:  scrollY>20 ? '#d4d4d8' : 'transparent'}]}>
                <View style={styles.header_container}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate("(house)", { screen: "housemange" })}
                    >
                        <Text style={styles.backButton_text}>Chỉnh Sửa</Text>
                    </TouchableOpacity>

                    <View
                        style={[
                            styles.clusterText
                        ]}
                    >
                        <Text style={[styles.clusterText_text, {color: '#000'}]}>Nhà</Text>
                    </View>

                    <View style={styles.buttonBar}>
                        <TouchableOpacity
                            style={[styles.buttonBar_button]}
                            onPress={() => navigation.goBack() }
                            // onPress={() => navigation.navigate( "(main)", { screen: "(home)", params: { screen: "index" } } ) }
                        >
                            <Text style={styles.buttonBar_buttonText}>Xong</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
};

export default Manage;

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

});

