import { Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import IconCPN from './Icon';
import classGlobal from '@/constants/class';
import variablesGlobal from '@/constants/variables';


const ButtonCPN = ({content='Nhấn', type='primary', handlePress, isLoading = false, disable=false, icon = null}) => {

    return (
        <TouchableOpacity
            disabled={disable}
            title={content}
            activeOpacity={0.75}
            onPress={disable ? () => {} : handlePress}
            style={
                [
                    type == 'nothing' ? {} : styles.container,
                    classGlobal.button[type][0],
                    { opacity: disable ? 0.5 : 1 }
                ]
            }
        >
            {
                icon
                &&
                <IconCPN iconName={icon.name} size={icon.size} color={icon.color}></IconCPN>
            }
            <Text style={ [(type == 'nothing') ? {fontSize: 0} : styles.text, classGlobal.button[type][1]] }>{content.toUpperCase()}</Text>
            {
                isLoading
                &&
                <ActivityIndicator
                    animating={isLoading}
                    color="#fff"
                    size="small"
                    className="ml-2"
                />
            }
        </TouchableOpacity>
    );
};

export default ButtonCPN

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 17,
        borderRadius: variablesGlobal.borderRadius,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 15
    },
    text: {
        fontSize: 16,
        fontWeight: 600,
        textAlign: 'center'
    }
})



