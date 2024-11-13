// import React, { useEffect, useState } from 'react';
// import { View, Modal, StyleSheet, Dimensions, TouchableWithoutFeedback, StatusBar } from 'react-native';

// const PopoverOverlay = ({ visible, buttonRef, children, onClose }) => {

//     const [position, setPosition] = useState({ top: 0, left: 0 });
//     const [popoverSize, setPopoverSize] = useState({ width: 0, height: 0 });

//     useEffect(() => {
//         if (visible && buttonRef?.current) {
//             // Measure the position of the button
//             buttonRef.current.measure((fx, fy, width, height, px, py) => {

//                 console.log('fx: ', fx, 'fy: ', fy, 'width: ', width, 'height: ', height, 'px: ', px, 'py: ', py);

//                 const screen = Dimensions.get('window');
//                 const popoverWidth = popoverSize.width || 150; // Default width if not set
//                 const popoverHeight = popoverSize.height || 100; // Default height if not set

//                 const btn_x_left = px;
//                 const btn_x_right = px + width;
//                 const btn_y_top = py;
//                 const btn_y_bottom = py + height;

//                 // algrorithm to calculate position x of popover
//                 let popover_x_left = px - popoverWidth + width ;
//                 let popover_x_right = popover_x_left + popoverWidth;


//                 if ( popover_x_left < 0 ) {
//                     popover_x_left = 0; popover_x_right = popover_x_left + popoverWidth;

//                     let arrayCase = [0, 0, 0, 0];

//                     arrayCase[0] = Math.abs(btn_x_left - popover_x_left);
//                     arrayCase[1] = Math.abs(btn_x_right - popover_x_right);

//                     popover_x_left = btn_x_left; popover_x_right = popover_x_left + popoverWidth;
//                     if (popover_x_right > screen.width) {
//                         popover_x_left = screen.width - popoverWidth;
//                         popover_x_right = popover_x_left + popoverWidth;
//                     }

//                     arrayCase[2] = Math.abs(popover_x_left - btn_x_left);
//                     arrayCase[3] = Math.abs(popover_x_right - btn_x_right);

//                     let minIndex = arrayCase.indexOf(Math.min(...arrayCase));

//                     if (minIndex <= 1) {
//                         popover_x_left = 0; popover_x_right = popover_x_left + popoverWidth;
//                     }
//                 }

//                 // algrorithm to calculate position y of popover
//                 let popover_y_top = py + height + 10;
//                 let popover_y_bottom = popover_y_top + popoverHeight;

//                 // Check if popover exceeds the bottom of the screen
//                 if (popover_y_bottom > screen.height) {
//                     // Check if there's enough space above the button to display the popover
//                     if (btn_y_top - popoverHeight - 10 > 0) {
//                         // Display popover above the button
//                         popover_y_top = btn_y_top - popoverHeight - 10;
//                     } else {
//                         // Not enough space above or below, so place popover in the middle
//                         popover_y_top = Math.max(10, screen.height - popoverHeight - 10);
//                     }
//                 }



//                 setPosition({ top: popover_y_top, left: popover_x_left });
//             });
//         }
//     }, [visible, buttonRef, popoverSize]);

//     if (!visible) {
//         return null;
//     }

//     console.log('position: ', position);


//     return (
//         <Modal
//             transparent={true}
//             animationType="fade"
//             visible={visible}
//             onRequestClose={onClose}
//             statusBarTranslucent={true}  // Enable modal to extend under the status bar
//         >
//             {/* Ẩn thanh trạng thái khi modal xuất hiện */}
//             <StatusBar backgroundColor="rgba(0, 0, 0, 0.3)" translucent={true} />

//             <TouchableWithoutFeedback onPress={onClose}>
//                 <View style={styles.overlay}>
//                     <View
//                         style={[styles.popoverContainer, { top: position.top, left: position.left }]}
//                         onLayout={(event) => {
//                             // Capture the popover's size to adjust the position
//                             const { width, height } = event.nativeEvent.layout;
//                             setPopoverSize({ width, height });
//                         }}
//                     >
//                         {children}
//                     </View>
//                 </View>
//             </TouchableWithoutFeedback>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         // backgroundColor: 'transparent', // Dark background overlay
//         backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark background overlay
//         paddingTop: StatusBar.currentHeight, // Đảm bảo rằng modal bắt đầu từ dưới status bar
//     },
//     popoverContainer: {
//         position: 'absolute',
//         backgroundColor: 'white',
//         padding: 10,
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
// });

// export default PopoverOverlay;

// --------------------------------------------------------------------------------------------------------------------------------


import React, { useEffect, useState, useRef } from 'react';
import { View, Modal, StyleSheet, Dimensions, TouchableWithoutFeedback, StatusBar, Animated } from 'react-native';

interface PopoverOverlayProps {
    visible: boolean;
    buttonRef: React.RefObject<View>;
    children: React.ReactNode;
    onClose: () => void;
}

const PopoverOverlay: React.FC<PopoverOverlayProps> = ({ visible, buttonRef, children, onClose }) => {

    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [popoverSize, setPopoverSize] = useState({ width: 0, height: 0 });
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    // Animated values for scale and opacity
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible && buttonRef?.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                const screen = Dimensions.get('window');
                const popoverWidth = popoverSize.width || 150; // Default width if not set
                const popoverHeight = popoverSize.height || 100; // Default height if not set

                const btn_x_left = px;
                const btn_x_right = px + width;
                const btn_y_top = py;
                const btn_y_bottom = py + height;

                // algrorithm to calculate position x of popover
                let popover_x_left = px - popoverWidth + width ;
                let popover_x_right = popover_x_left + popoverWidth;


                if ( popover_x_left < 0 ) {
                    popover_x_left = 0; popover_x_right = popover_x_left + popoverWidth;

                    let arrayCase = [0, 0, 0, 0];

                    arrayCase[0] = Math.abs(btn_x_left - popover_x_left);
                    arrayCase[1] = Math.abs(btn_x_right - popover_x_right);

                    popover_x_left = btn_x_left; popover_x_right = popover_x_left + popoverWidth;
                    if (popover_x_right > screen.width) {
                        popover_x_left = screen.width - popoverWidth;
                        popover_x_right = popover_x_left + popoverWidth;
                    }

                    arrayCase[2] = Math.abs(popover_x_left - btn_x_left);
                    arrayCase[3] = Math.abs(popover_x_right - btn_x_right);

                    let minIndex = arrayCase.indexOf(Math.min(...arrayCase));

                    if (minIndex <= 1) {
                        popover_x_left = 0; popover_x_right = popover_x_left + popoverWidth;
                    }
                }

                // algrorithm to calculate position y of popover
                let popover_y_top = py + height + 10;
                let popover_y_bottom = popover_y_top + popoverHeight;

                // Check if popover exceeds the bottom of the screen
                if (popover_y_bottom > screen.height) {
                    // Check if there's enough space above the button to display the popover
                    if (btn_y_top - popoverHeight - 10 > 0) {
                        // Display popover above the button
                        popover_y_top = btn_y_top - popoverHeight - 10;
                    } else {
                        // Not enough space above or below, so place popover in the middle
                        popover_y_top = Math.max(10, screen.height - popoverHeight - 10);
                    }
                }

                // Set the position of the popover
                setPosition({ top: popover_y_top, left: popover_x_left });

                // Set flag to allow animation to start
                setIsPositionCalculated(true);
            });
        } else {
            // Animate out when hiding popover
            Animated.timing(scaleAnim, {
                toValue: 0, // Shrink back to 0 when closing
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                // Set position as not calculated after the animation finishes
                setIsPositionCalculated(false);
            });

            Animated.timing(opacityAnim, {
                toValue: 0, // Fade out
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, buttonRef, popoverSize]);

    useEffect(() => {
        if (isPositionCalculated) {
            // Animate in when position is ready
            Animated.timing(scaleAnim, {
                toValue: 1, // Scale up to full size
                duration: 300,
                useNativeDriver: true,
            }).start();
            Animated.timing(opacityAnim, {
                toValue: 1, // Fade in
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isPositionCalculated, scaleAnim, opacityAnim]);

    if (!visible && !isPositionCalculated) {
        return null;
    }

    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={visible || isPositionCalculated} // Keep modal visible during the closing animation
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            {/* Ẩn thanh trạng thái khi modal xuất hiện */}
            <StatusBar backgroundColor="rgba(0, 0, 0, 0)" translucent={true} />

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <Animated.View
                        style={[
                            styles.popoverContainer,
                            { top: position.top, left: position.left },
                            {
                                // transform: [
                                //     { translateX: -popoverSize.width / 2 }, // Shift popover to the top-left corner
                                //     { translateY: -popoverSize.height / 2 },
                                //     { scale: scaleAnim }, // Scale the popover
                                //     { translateX: popoverSize.width / 2 }, // Reset back after scaling
                                //     { translateY: popoverSize.height / 2 },
                                // ],
                                opacity: opacityAnim, // Animate opacity
                            }
                        ]}
                        onLayout={(event) => {
                            const { width, height } = event.nativeEvent.layout;
                            setPopoverSize({ width, height });
                        }}
                    >
                        {children}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)', // Dark background overlay
        paddingTop: StatusBar.currentHeight, // Ensure modal starts below status bar
    }, 
    popoverContainer: {
        position: 'absolute',
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 200, height: 200 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
        elevation: 30,
    },
});

export default PopoverOverlay;


// --------------------------------------------------------------------------------------------------------------------------------

