import { Text, View, StyleSheet, Touchable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonCPN from '@/components/Button';
import InputCPN from '@/components/Input';
import colorGlobal from '@/constants/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AuthenFetch from '@/fetch/Authen.fetch';
import { ResponseDTO, ResponseMessageDTO } from '@/types/FetchDTO';
import axios from 'axios';
import { AuthContext } from '@/hooks/context/Auth.context';


const LogInScreen = () => {

    const navigation = useNavigation();

    const { saveToken, setTimeLiveAccessToken } = React.useContext(AuthContext) || {};

    const [usernameInput, setUsernameInput] = React.useState({ value: 'ndm', errorMessage: '' });
    const [passwordInput, setPasswordInput] = React.useState({ value: '123456@Abcc', errorMessage: '' });
    const [isLogIn, setIsLogIn] = React.useState(false);

    const handleLogIn = async () => {
        setIsLogIn(true);
        try {
            const response = await AuthenFetch.logIn({
                username: usernameInput.value,
                password: passwordInput.value,
            });

            saveToken && saveToken(process.env.EXPO_PUBLIC_TOKEN_ACCESS_NAME || 'access_token', response.data.access_token.token);
            saveToken && saveToken(process.env.EXPO_PUBLIC_TOKEN_REFRESH_NAME || 'refresh_token', response.data.refresh_token.token);

            // setTimeLiveAccessToken && setTimeLiveAccessToken(response.data.access_token.expires_in*1000);
            setTimeLiveAccessToken && setTimeLiveAccessToken(20000);

            navigation.navigate( "(main)", { screen: "(home)", params: { screen: "index" } } )

        } catch (error:any) {
            const response:ResponseDTO = error?.response?.data;

            // Kiểm tra mã lỗi
            if (response.code === 400) {
                response.message.forEach((mess:ResponseMessageDTO) => {
                    if (mess.property === 'username') {
                        setUsernameInput({
                            ...usernameInput,
                            errorMessage: mess.message,
                        });
                    }
                    if (mess.property === 'password') {
                        setPasswordInput({
                            ...passwordInput,
                            errorMessage: mess.message,
                        });
                    }
                });
            }
        }
        setIsLogIn(false);
    };


    const handleCheckInput = () => {
        let isCheck = true;

        // let emailValidate = isValidEmail(emailInput.value);
        // if (!emailValidate.isValid) {
        //     setEmailInput({...emailInput, errorMessage: emailValidate.errors[0]});
        //     isCheck = false;
        // } else {
        //     setEmailInput({...emailInput, errorMessage: ''});
        // }

        let usernameValidate = isValidUsername(usernameInput.value);
        if (!usernameValidate.isValid) {
            setUsernameInput({ ...usernameInput, errorMessage: usernameValidate.errors[0] });
            isCheck = false;
        } else {
            setUsernameInput({ ...usernameInput, errorMessage: '' });
        }

        let passwordValidate = isValidPassword(passwordInput.value);
        if (!passwordValidate.isValid) {
            setPasswordInput({ ...passwordInput, errorMessage: passwordValidate.errors[0] });
            isCheck = false;
        } else {
            setPasswordInput({ ...passwordInput, errorMessage: '' });
        }

        if (isCheck) {
            handleLogIn();
        }
    }

    // Hàm kiểm tra email
    const isValidEmail = (email: string) => {

        email = email.trim();

        if (email === '') {
            return {
                isValid: false,
                errors: ['Email không được để trống']
            };
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const rules = {
            hasAtSymbol: email.includes('@'),
            hasDot: email.includes('.'),
            validLength: email.length >= 5 && email.length <= 255,
            noSpaces: !email.includes(' '),
            validPattern: emailPattern.test(email)
        };

        return {
            isValid: Object.values(rules).every(rule => rule === true),
            errors: Object.entries(rules)
                .filter(([_, value]) => !value)
                .map(([key]) => {
                    switch (key) {
                        case 'hasAtSymbol': return 'Email phải chứa ký tự @';
                        case 'hasDot': return 'Email phải chứa dấu chấm';
                        case 'validLength': return 'Email phải từ 5 đến 255 ký tự';
                        case 'noSpaces': return 'Email không được chứa khoảng trắng';
                        case 'validPattern': return 'Email không đúng định dạng';
                        default: return 'Email không hợp lệ';
                    }
                })
        };
    };

    // Hàm kiểm tra username
    const isValidUsername = (username: string) => {

        username = username.trim();

        if (username === '') {
            return {
                isValid: false,
                errors: ['Username không được để trống']
            };
        }

        // Các quy tắc kiểm tra
        const rules = {
            // Chỉ chấp nhận chữ cái latinh, số và dấu gạch dưới
            validCharacters: /^[a-zA-Z0-9_]+$/.test(username),

            // Độ dài từ 3-20 ký tự
            validLength: username.length >= 3 && username.length <= 20,

            // Phải bắt đầu bằng chữ cái
            startsWithLetter: /^[a-zA-Z]/.test(username),

            // Không có khoảng trắng
            noSpaces: !username.includes(' '),

            // Không có ký tự đặc biệt (ngoại trừ dấu gạch dưới)
            noSpecialChars: !/[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/.test(username),

            // Không có các ký tự Unicode đặc biệt
            noUnicode: !/[^\x00-\x7F]+/.test(username)
        };

        return {
            isValid: Object.values(rules).every(rule => rule === true),
            errors: Object.entries(rules)
                .filter(([_, value]) => !value)
                .map(([key]) => {
                    switch (key) {
                        case 'validCharacters':
                            return 'Username chỉ được chứa chữ cái latinh, số và dấu gạch dưới';
                        case 'validLength':
                            return 'Username phải từ 3 đến 20 ký tự';
                        case 'startsWithLetter':
                            return 'Username phải bắt đầu bằng chữ cái';
                        case 'noSpaces':
                            return 'Username không được chứa khoảng trắng';
                        case 'noSpecialChars':
                            return 'Username không được chứa ký tự đặc biệt';
                        case 'noUnicode':
                            return 'Username không được chứa ký tự Unicode đặc biệt';
                        default:
                            return 'Username không hợp lệ';
                    }
                })
        };
    };

    // Hàm kiểm tra password
    const isValidPassword = (password: string) => {
        password = password.trim();

        if (password === '') {
            return {
                isValid: false,
                errors: ['Password không được để trống']
            };
        }

        // Các quy tắc kiểm tra
        const rules = {
            // Độ dài từ 8-30 ký tự
            validLength: password.length >= 8 && password.length <= 30,

            // Phải chứa ít nhất một chữ cái viết thường
            hasLowercase: /[a-z]/.test(password),

            // Phải chứa ít nhất một chữ cái viết hoa
            hasUppercase: /[A-Z]/.test(password),

            // Phải chứa ít nhất một chữ số
            hasNumber: /[0-9]/.test(password),

            // Phải chứa ít nhất một ký tự đặc biệt
            hasSpecialChar: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(password),

            // Không chứa khoảng trắng
            noSpaces: !/\s/.test(password),

            // Không có các ký tự Unicode đặc biệt
            noUnicode: !/[^\x00-\x7F]+/.test(password)
        };

        return {
            isValid: Object.values(rules).every(rule => rule === true),
            errors: Object.entries(rules)
                .filter(([_, value]) => !value)
                .map(([key]) => {
                    switch (key) {
                        case 'validLength':
                            return 'Password phải từ 8 đến 30 ký tự';
                        case 'hasLowercase':
                            return 'Password phải chứa ít nhất một chữ cái viết thường';
                        case 'hasUppercase':
                            return 'Password phải chứa ít nhất một chữ cái viết hoa';
                        case 'hasNumber':
                            return 'Password phải chứa ít nhất một chữ số';
                        case 'hasSpecialChar':
                            return 'Password phải chứa ít nhất một ký tự đặc biệt';
                        case 'noSpaces':
                            return 'Password không được chứa khoảng trắng';
                        case 'noUnicode':
                            return 'Password không được chứa ký tự Unicode đặc biệt';
                        default:
                            return 'Password không hợp lệ';
                    }
                })
        };
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom', 'top']}>
            <View style={styles.viewInput}>
                <Text style={styles.viewInput_title}>Đăng nhập</Text>
                <View style={{ marginTop: 25 }}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <InputCPN label="Tên đăng nhập" placeholder="tuanngoc, lethanh, tramanh,..." autoCapitalize="none" value={usernameInput.value} errorMessage={usernameInput.errorMessage} onChange={(text) => setUsernameInput(prev => ({ ...prev, value: text }))}></InputCPN>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <InputCPN label="Mật khẩu" type='password' placeholder="Nên sử dụng ký tự in hoa và đặc biệt" autoCapitalize="none" value={passwordInput.value} errorMessage={passwordInput.errorMessage} onChange={(text) => setPasswordInput(prev => ({ ...prev, value: text }))}></InputCPN>
                </View>
                <View style={{ marginTop: 10 }}></View>
                <ButtonCPN content='Đăng nhập' type='primary' handlePress={() => handleCheckInput()} disable={isLogIn} isLoading={isLogIn}/>
            </View>
            <View>
                <View style={styles.linkBar}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("(auth)", { screen: "signUpScreen" })}>
                        <Text style={styles.linkBar_link}>Đăng ký</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <Text style={styles.linkBar_link}>Bạn quên mật khẩu?</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.linkBar_line}>
                    <Text style={styles.linkBar_line_title}>Lựa chọn khác</Text>
                </View>
            </View>
            <View style={styles.ortherMethodView}>
                <View>
                    <ButtonCPN content='Google' type='cancel' handlePress={() => { }} disable={true} icon={{ name: 'google', size: 22 }} />
                </View>
                <View>
                    <ButtonCPN content='Microsoft' type='cancel' handlePress={() => { }} disable={true} icon={{ name: 'microsoft', size: 22 }} />
                </View>
                <View>
                    <Text style={styles.ortherMethodView_commitText}>
                        Chúng tôi đảm bảo an toàn cho các thông tin của bạn cung cấp theo chính sách pháp luật quốc gia của bạn!
                    </Text>
                    {/* <Link href='http://smartome.dnmanh.io.vn:65535' style={styles.ortherMethodView_trademark}>weather.dnmanh.io.vn</Link> */}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LogInScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingTop: 40,
        paddingHorizontal: 20,
        backgroundColor: colorGlobal.backColor,
    },
    viewInput: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        rowGap: 5,
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
        justifyContent: 'space-between',
    },
    linkBar_link: {
        color: colorGlobal.textLink,
        fontSize: 16,
    },
    linkBar_line: {
        marginVertical: 50,
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
