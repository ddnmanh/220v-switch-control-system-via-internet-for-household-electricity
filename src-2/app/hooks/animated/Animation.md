
### Hook
```vscode
import {useRef} from 'react';
import {Animated} from 'react-native';

const useAnimation = (initialValues = {}) => {
  const animValues = useRef({
    opacity: new Animated.Value(initialValues.opacity || 0),
    translateY: new Animated.Value(initialValues.translateY || 0),
    scale: new Animated.Value(initialValues.scale || 1),
    rotate: new Animated.Value(initialValues.rotate || 0),
  }).current;

  const fadeIn = (duration = 5000) => {
    Animated.timing(animValues.opacity, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (duration = 3000) => {
    Animated.timing(animValues.opacity, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const translateY = (toValue, duration = 1000) => {
    Animated.timing(animValues.translateY, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const scaleTo = (toValue, duration = 1000) => {
    Animated.timing(animValues.scale, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const rotateTo = (toValue, duration = 1000) => {
    Animated.timing(animValues.rotate, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return {
    animValues,
    fadeIn,
    fadeOut,
    translateY,
    scaleTo,
    rotateTo,
  };
};

export default useAnimation;

```


### Use
```vscode
import React from 'react';
import {Animated, Text, View, StyleSheet, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import useAnimation from './useAnimation'; // Import hook

const App = () => {
  const {animValues, fadeIn, fadeOut, translateY, scaleTo, rotateTo} = useAnimation({
    opacity: 0,
    translateY: 0,
    scale: 1,
    rotate: 0,
  });

  const rotate = animValues.rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: animValues.opacity, // Fade effect
              transform: [
                {translateY: animValues.translateY}, // Translation effect
                {scale: animValues.scale}, // Scaling effect
                {rotate}, // Rotation effect
              ],
            },
          ]}>
          <Text style={styles.text}>Animated View!</Text>
        </Animated.View>
        <View style={styles.buttonRow}>
          <Button title="Fade In" onPress={() => fadeIn(3000)} />
          <Button title="Fade Out" onPress={() => fadeOut(3000)} />
          <Button title="Move Down" onPress={() => translateY(100, 1000)} />
          <Button title="Scale Up" onPress={() => scaleTo(1.5, 1000)} />
          <Button title="Rotate 360°" onPress={() => rotateTo(360, 2000)} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContainer: {
    padding: 20,
    backgroundColor: 'powderblue',
  },
  text: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 150,
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
});

export default App;

```
