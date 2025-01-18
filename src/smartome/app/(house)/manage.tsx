

import IconCPN from '@/components/Icon';
import variablesGlobal from '@/constants/variables';
import useMyAnimation from '@/hooks/animated/Animation.animated';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {HouseContext} from '@/hooks/context/HouseData.context';
import fontsGlobal from '@/constants/fonts';

const Manage = () => {

    const navigation = useNavigation();
    const { houseDataChosen } = React.useContext(HouseContext) || { houseDataChosen: {} };

    const houseNameOnHeaderAnimation = useMyAnimation({ opacity: 0, translateY: 0, scale: 1, rotate: 0 });

    const [forcusHouseNameInput, setForcusHouseNameInput] = React.useState(false);

    const [scrollY, setScrollY] = React.useState(0);

    const handleBackButton = () => {
        navigation.goBack();
    }

    return (
        <View style={{backgroundColor: 'transparent', flex: 1}}>
            <View style={[styles.header, scrollY < 20 ? {backgroundColor: 'transparent', borderBottomColor: 'transparent'} : {} ]}>
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
                        <Text style={[styles.headerClusterTittle_text]}>Quản lý nhà</Text>
                    </View>
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

        </View>
    );
};

export default Manage;

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

