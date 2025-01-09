import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonCPN from '@/components/Button';
import InputCPN from '@/components/Input';
import colorGlobal from '@/constants/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AuthenFetch from '@/fetch/Authen.fetch';
import { ResponseDTO, ResponseMessageDTO } from '@/interfaces/Fetch.interface';

export default function OTPVerify({route}: any) {

    const { idRegister, email } = route.params || {};

    const navigation = useNavigation();

    const [otpInput, setOtpInput] = React.useState({value: '', errorMessage: ''});
    const [isVerify, setIsVerify] = React.useState(false);

    const handleCheckInput = () => {

        let isValid = true;

        if (otpInput.value.trim() === '') {
            isValid = false;
            setOtpInput(prev => ({...prev, errorMessage: 'Vui lòng nhập mã xác thực'}));
        }

        if (otpInput.value.trim().length < 6 || otpInput.value.trim().length > 6) {
            isValid = false;
            setOtpInput(prev => ({...prev, errorMessage: 'Mã xác thực không hợp lệ'}));
        }

        if (isValid) {
            handleVerifyOTP();
        }
    }

    const handleVerifyOTP = async () => {
        setIsVerify(true);
        try {
            const response = await AuthenFetch.verifyOTP({
                email: email,
                otp: otpInput.value,
            });

            navigation.navigate( "(auth)", { screen: "logInScreen" } )

        } catch (error:any) {
            const response:ResponseDTO = error?.response?.data;

            console.log(response);


            // Kiểm tra mã lỗi
            if (response.code === 400) {
                response.message.forEach((mess:ResponseMessageDTO) => {
                    if (mess.property === 'otp') {
                        setOtpInput({
                            ...otpInput,
                            errorMessage: mess.message,
                        });
                    }
                });
            }
        }
        setIsVerify(false);
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom', 'top']}>
            <View style={styles.viewInput}>
                <Text style={styles.viewInput_title}>Xác Thực OTP</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <InputCPN label="" placeholder="Mã xác thực 6 chữ số từ email" autoCapitalize="none" value={otpInput.value} errorMessage={otpInput.errorMessage} onChange={(text) => setOtpInput(prev => ({...prev, value: text}))}></InputCPN>
                </View>
                <ButtonCPN content='Xác Thực' type='primary' handlePress={() => handleCheckInput() } disable={isVerify} isLoading={isVerify}/>
            </View>
            <View>
                <View style={styles.linkBar}>
                    <Text>Lấy mã xác thực từ email trước đó </Text>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate( "(auth)", { screen: "logInScreen" } ) }>
                        <Text style={styles.linkBar_link}>Đến Email</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingTop: 90,
        paddingHorizontal: 20,
        backgroundColor: colorGlobal.backColor,
    },
    viewInput: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        rowGap: 18,
        columnGap: 18,
    },
    viewInput_title: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'semibold',
    },
    linkBar: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    linkBar_link: {
        color: colorGlobal.textLink,
        fontSize: 16,
    },
    linkBar_line: {
        marginVertical: 28,
        borderTopWidth: 1,
        borderTopColor: colorGlobal.borderLine,
        position: 'relative',
    },
    linkBar_line_title: {
        position: 'absolute',
        top: -7, // -(lineHeight / 2)
        left: '50%',
        transform: [{ translateX: -54 }], // (width text + paddingHorizontal) /2
        paddingHorizontal: 8,
        backgroundColor: colorGlobal.backColor,
        color: colorGlobal.textDesc,
        fontSize: 14,
        lineHeight: 14,
    },
    ortherMethodView: {
        flexDirection: 'column',
        alignItems: 'stretch',
        rowGap: 18,
    },
    ortherMethodView_commitText: {
        color: colorGlobal.textDesc,
        fontSize: 12,
    },
    ortherMethodView_trademark: {
        marginTop: 60,
        color: colorGlobal.textDesc,
        fontSize: 14,
        textAlign: 'center',
    }
})
