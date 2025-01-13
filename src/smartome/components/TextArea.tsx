import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';

import colorGlobal from '@/constants/colors';
import variablesGlobal from '@/constants/variables';

interface TextAreaCPNProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
    numberOfLines?: number;
    maxLength?: number;
    errorMessage?: string;
    [key: string]: any;
}

const TextAreaCPN: React.FC<TextAreaCPNProps> = ({
    label,
    placeholder,
    value,
    onChange,
    numberOfLines = 5,
    maxLength = 200,
    errorMessage = false,
    ...props
}) => {
    return (
        <View style={styles.container}>
            {label !== '' && (
                <Text style={[styles.label, { color: errorMessage ? colorGlobal.textDanger : '' }]}>{label}</Text>
            )}
            <View style={[styles.textAreaCluster, { borderColor: errorMessage ? colorGlobal.danger : colorGlobal.border }]}>
                <TextInput
                    style={[styles.textAreaCluster_input, { height: numberOfLines * 24 }]} // Tăng chiều cao dựa trên số dòng
                    multiline={true}
                    placeholder={placeholder ? placeholder : `Nhập ${label}`}
                    value={value}
                    onChangeText={onChange}
                    maxLength={maxLength}
                    {...props}
                />
            </View>
            <Text style={styles.characterCount}>{`${value.length}/${maxLength}`}</Text>
            <Text style={styles.errorMessage}>{errorMessage ? errorMessage : ''}</Text>
        </View>
    );
};

export default TextAreaCPN;

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
    textAreaCluster: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderWidth: 1.35,
        borderRadius: variablesGlobal.borderRadius,
        overflow: 'hidden',
    },
    textAreaCluster_input: {
        fontSize: variablesGlobal.inputFontSize,
        paddingHorizontal: variablesGlobal.inputPaddingX,
        paddingVertical: 10,
        textAlignVertical: 'top', // Giúp căn chỉnh văn bản trong TextInput multiline
    },
    characterCount: {
        fontSize: 12,
        color: colorGlobal.textSecondary,
        textAlign: 'right',
    },
    errorMessage: {
        fontSize: 12,
        color: colorGlobal.danger,
        lineHeight: 12,
    },
});
