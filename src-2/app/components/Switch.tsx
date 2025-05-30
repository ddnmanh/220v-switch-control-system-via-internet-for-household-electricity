import {
    Pressable,
    View,
    Animated,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import { useEffect, useState } from 'react';
import LinearGradient from 'expo-linear-gradient';
import colorGlobal from '@/constants/colors';

interface SwitchnProps {

    value: boolean;

    onValueChange: (value: boolean) => void;

}

const SwitchCPN = (props:SwitchnProps) => {
    const { value, onValueChange } = props;
    const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

    useEffect(() => {
        // Update the animated value when the value prop changes
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 300, // Adjust the animation duration
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 20], // Adjust the distance of the switch head
    });

    const toggleSwitch = () => {
        const newValue = !value;
        onValueChange(newValue);
    };


    return (
        <Pressable
            onPress={toggleSwitch}
            style={[
                styles.pressable,
                {
                    width: 36,
                    height: 20,
                },
            ]}
        >
            <View
                style={[
                    styles.backgroundGradient,
                    {
                        backgroundColor: value ? '#FB923C' : '#ccc',
                    },
                ]}
            >
                <View style={styles.innerContainer}>
                    <Animated.View
                        style={[
                            {
                                transform: [{ translateX }]
                            },
                            styles.headGradient,
                        ]}>
                        <View
                            style={[
                                styles.headGradient,
                                {
                                    backgroundColor: '#fff',
                                    width: 13,
                                    height: 13,
                                },
                            ]}
                        />
                    </Animated.View>
                </View>
            </View>
        </Pressable>
    );
};

export default SwitchCPN;

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 28,
    },
    backgroundGradient: {
        borderRadius: 16,
        flex: 1,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        position: 'relative',
    },
    headGradient: {
        borderRadius: 100,
    },
});



