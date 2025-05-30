

import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardTypeOptions } from 'react-native'
import React from 'react'
import IconCPN from './Icon';

import colorGlobal from '@/constants/colors';
import variablesGlobal from '@/constants/variables';


interface InputCPNProps {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    errorMessage?: string;
    [key: string]: any;
}

const InputCPN: React.FC<InputCPNProps> = ({label, type='text', placeholder, value, onChange, keyboardType = 'default', errorMessage=false, ...props}) => {

    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <View style={styles.container}>
            {
                label !== ''
                &&
                <Text style={[styles.label, { color: errorMessage ? colorGlobal.textDanger : '' }]} >{label}</Text>
            }
            <View style={[styles.inputCluster, { borderColor: errorMessage ? colorGlobal.danger : colorGlobal.border }]}>
                <TextInput
                    style={styles.inputCluster_input}
                    secureTextEntry={type === 'password' && !showPassword}
                    placeholder={placeholder ? placeholder : `Nhập ${label}`}
                    keyboardType={keyboardType}
                    value={value}
                    onChangeText={onChange}
                    {...props}
                ></TextInput>
                {
                    type === "password"
                    &&
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{marginRight: 10}}>
                        <IconCPN iconName={showPassword ? 'eyeSlash' :'eye'} size={20} color={colorGlobal.secondary}></IconCPN>
                    </TouchableOpacity>
                }
            </View>
            <Text style={styles.errorMessage}>{errorMessage ? errorMessage : ''}</Text>
        </View>
    )
}

export default InputCPN;


const styles = StyleSheet.create({
    container: {
        width: 'auto',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        rowGap: 5,
    },
    label: {
        fontSize: 15,
        fontWeight: 'normal',
        color: colorGlobal.textPrimary,
    },
    inputCluster: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.35,
        borderRadius: variablesGlobal.borderRadius,
        overflow: 'hidden',
    },
    inputCluster_input: {
        flex: 1,
        fontSize: variablesGlobal.inputFontSize,
        paddingHorizontal: variablesGlobal.inputPaddingX,
        height: 42,
    },
    errorMessage: {
        fontSize: 12,
        color: colorGlobal.danger,
        lineHeight: 12,
    }
})
