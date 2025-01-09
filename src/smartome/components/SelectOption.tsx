import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import IconCPN from './Icon';

import colorGlobal from '@/constants/colors';
import variablesGlobal from '@/constants/variables';

interface Option {
    label: string;
    value: string;
}

interface SelectOptionCPNProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    errorMessage?: string;
    [key: string]: any;
}

const SelectOptionCPN: React.FC<SelectOptionCPNProps> = ({ label, options, value, onChange, errorMessage = false, ...props }) => {
    const [isDropdownVisible, setDropdownVisible] = React.useState(false);

    const handleSelectOption = (selectedValue: string) => {
        onChange(selectedValue);
        setDropdownVisible(false);
    };

    return (
        <View style={styles.container}>
            {
                label !== '' && (
                    <Text style={[styles.label, { color: errorMessage ? colorGlobal.textDanger : '' }]}>{label}</Text>
                )
            }

            <View style={{width: '100%', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', rowGap: 2}}>
                <TouchableOpacity
                    style={[styles.selectCluster, { borderColor: errorMessage ? colorGlobal.danger : colorGlobal.border }]}
                    onPress={() => setDropdownVisible(!isDropdownVisible)}
                >
                    <Text style={styles.selectedValue}>{
                        options.find(option => option.value === value)?.label || `Chọn ${label}`
                    }</Text>
                    <IconCPN iconName={isDropdownVisible ? 'caretUpSolid' : 'caretDownSolid'} size={12} color={colorGlobal.textDesc} />
                </TouchableOpacity>

                {
                    isDropdownVisible && (
                        <View style={styles.dropdown}>
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.option, { borderTopWidth: item.value === options[0].value ? 0 : 1 }]}
                                        onPress={() => handleSelectOption(item.value)}
                                    >
                                        <Text style={styles.optionLabel}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )
                }
            </View>

            <Text style={styles.errorMessage}>{errorMessage ? errorMessage : ''}</Text>
        </View>
    );
};

export default SelectOptionCPN;

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
    selectCluster: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.35,
        borderRadius: variablesGlobal.borderRadius,
        overflow: 'hidden',
        paddingHorizontal: variablesGlobal.inputPaddingX,
        height: 42,
        position: 'relative',
    },
    selectedValue: {
        flex: 1,
        fontSize: variablesGlobal.inputFontSize,
        color: colorGlobal.textPrimary,
    },
    dropdown: {
        borderWidth: 1.35,
        borderColor: colorGlobal.border,
        borderRadius: variablesGlobal.borderRadius,
        backgroundColor: 'white',
        marginTop: 5,
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 9999
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: colorGlobal.border,
    },
    optionLabel: {
        fontSize: variablesGlobal.inputFontSize,
        color: colorGlobal.textPrimary,
    },
    errorMessage: {
        fontSize: 12,
        color: colorGlobal.danger,
        lineHeight: 12,
    },
});
