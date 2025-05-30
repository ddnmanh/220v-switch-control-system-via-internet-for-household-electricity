import { useRef } from 'react';
import { Animated } from 'react-native';

interface AnimationValues {
    opacity?: number;
    translateY?: number;
    scale?: number;
    rotate?: number;
}

const useMyAnimation = (initialValues: AnimationValues = {}) => {
    const animationValue = useRef({
        opacity: new Animated.Value(initialValues.opacity || 0),
        translateY: new Animated.Value(initialValues.translateY || 0),
        scale: new Animated.Value(initialValues.scale || 1),
        rotate: new Animated.Value(initialValues.rotate || 0),
    }).current;

    const fadeIn = (duration = 5000) => {
        Animated.timing(animationValue.opacity, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = (duration = 3000) => {
        Animated.timing(animationValue.opacity, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
        }).start();
    };

    const translateY = (toValue: number, duration = 1000) => {
        Animated.timing(animationValue.translateY, {
            toValue,
            duration,
            useNativeDriver: true,
        }).start();
    };

    const scaleTo = (toValue: number, duration = 1000) => {
        Animated.timing(animationValue.scale, {
            toValue,
            duration,
            useNativeDriver: true,
        }).start();
    };

    const rotateTo = (toValue: number, duration = 1000) => {
        Animated.timing(animationValue.rotate, {
            toValue,
            duration,
            useNativeDriver: true,
        }).start();
    };

    return {
        animationValue,
        fadeIn,
        fadeOut,
        translateY,
        scaleTo,
        rotateTo,
    };
};

export default useMyAnimation;
