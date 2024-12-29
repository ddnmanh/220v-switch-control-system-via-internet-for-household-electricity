import { Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import IconCPN from './Icon';
import classGlobal from '@/constants/class';
import variablesGlobal from '@/constants/variables';
import { isLoading } from 'expo-font';

interface ButtonProps {

    content: string;

    type: 'primary' | 'cancel' | 'nothing';

    handlePress: () => void;

    isLoading?: boolean;

    disable: boolean;

    icon?: { name: string; size?: number, color?: string } | null | undefined;

}


const ButtonCPN = (props: ButtonProps) => {

    console.log(props.icon);


    return (
        <TouchableOpacity
            disabled={props.disable}
            // title={props.content}
            activeOpacity={0.75}
            onPress={props.disable ? () => {} : props.handlePress}
            style={
                [
                    props.type == 'nothing' ? {} : styles.container,
                    classGlobal.button[props.type][0],
                    { opacity: props.disable ? 0.5 : 1 }
                ]
            }
        >
            {
                props.icon
                &&
                <IconCPN iconName={props.icon.name} size={props.icon.size || 12} color={props.icon.color || ''}></IconCPN>
            }
            <Text style={ [(props.type == 'nothing') ? {fontSize: 0} : styles.text, classGlobal.button[props.type][1]] }>{props.content.toUpperCase()}</Text>
            {
                props.isLoading
                &&
                <ActivityIndicator
                    animating={props.isLoading}
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
        columnGap: 10
    },
    text: {
        fontSize: 16,
        fontWeight: 600,
        textAlign: 'center'
    }
})



