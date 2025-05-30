import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonCPN from '@/components/Button';
import InputCPN from '@/components/Input';
import colorGlobal from '@/constants/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AuthenFetch from '@/fetch/Authen.fetch';
import { ResponseDTO, ResponseInvalidFieldDTO } from '@/interfaces/Fetch.interface';
import { Divider } from 'react-native-paper';
import UserFetch from '@/fetch/User.fetch';

export default function SignUp() {

    const navigation = useNavigation();

    const [lastnameInput, setLastnameInput] = React.useState({value: 'Người Sử', errorMessage: ''});
    const [firstnameInput, setFirstnameInput] = React.useState({value: 'Dụng', errorMessage: ''});
    const [emailInput, setEmailInput] = React.useState({value: '', errorMessage: ''});
    const [usernameInput, setUsernameInput] = React.useState({value: '', errorMessage: ''});
    const [passwordInput, setPasswordInput] = React.useState({value: '', errorMessage: ''});
    const [isSignUp, setIsSignUp] = React.useState(false);

    const handleLogIn = async () => {
        setIsSignUp(true);
        try {
            const response = await UserFetch.register({
                username: usernameInput.value,
                password: passwordInput.value,
                email: emailInput.value,
            });

            console.log(response);


            navigation.navigate("(auth)", { screen: "otpVerifyScreen",  params: { email: emailInput.value } });

        } catch (error:any) {
            console.log(error.response.data);


            setIsSignUp(false);

            const response:ResponseDTO = error?.response?.data;

            // Kiểm tra mã lỗi
            if (response.status === 400) {
                response.invalid_field.forEach((invalidField:ResponseInvalidFieldDTO) => {
                    if (invalidField.property === 'email') {
                        setEmailInput({
                            ...emailInput,
                            errorMessage: invalidField.message,
                        });
                    }
                    if (invalidField.property === 'username') {
                        setUsernameInput({
                            ...usernameInput,
                            errorMessage: invalidField.message,
                        });
                    }
                });
            }
        }
        setIsSignUp(false);
    }

    const handleCheckInput = () => {
        let isCheck = true;

        let emailValidate = isValidEmail(emailInput.value);
        if (!emailValidate.isValid) {
            setEmailInput({...emailInput, errorMessage: emailValidate.errors[0]});
            isCheck = false;
        } else {
            setEmailInput({...emailInput, errorMessage: ''});
        }

        let usernameValidate = isValidUsername(usernameInput.value);
        if (!usernameValidate.isValid) {
            setUsernameInput({...usernameInput, errorMessage: usernameValidate.errors[0]});
            isCheck = false;
        } else {
            setUsernameInput({...usernameInput, errorMessage: ''});
        }

        let passwordValidate = isValidPassword(passwordInput.value);
        if (!passwordValidate.isValid) {
            setPasswordInput({...passwordInput, errorMessage: passwordValidate.errors[0]});
            isCheck = false;
        } else {
            setPasswordInput({...passwordInput, errorMessage: ''});
        }

        console.log(isCheck);


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
                    switch(key) {
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
                    switch(key) {
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
        <View style={styles.container}>
            <View style={styles.viewInput}>
                <Text style={styles.viewInput_title}>Đăng Ký</Text>
                <Divider style={{height: 20, backgroundColor: 'transparent'}}></Divider>
                {/* <View style={[styles.viewInput, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <InputCPN label="Họ và đệm" placeholder="Nhập họ và đệm" value={lastnameInput.value} errorMessage={lastnameInput.errorMessage} onChange={(text) => setLastnameInput(prev => ({...prev, value: text}))}></InputCPN>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <InputCPN label="Tên" placeholder="Nhập tên" value={firstnameInput.value} errorMessage={firstnameInput.errorMessage} onChange={(text) => setFirstnameInput(prev => ({...prev, value: text}))}></InputCPN>
                    </View>
                </View> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <InputCPN label="Email" placeholder="letuanngoc@gmail.com" autoCapitalize="none" value={emailInput.value} errorMessage={emailInput.errorMessage} onChange={(text) => setEmailInput(prev => ({...prev, value: text}))}></InputCPN>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <InputCPN label="Tên đăng nhập" placeholder="tuanngoc, lethanh, tramanh,..." autoCapitalize="none" value={usernameInput.value} errorMessage={usernameInput.errorMessage} onChange={(text) => setUsernameInput(prev => ({...prev, value: text}))}></InputCPN>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <InputCPN label="Mật khẩu" type='password' placeholder="8 đến 30 ký tự in hoa và đặc biệt" autoCapitalize="none" value={passwordInput.value} errorMessage={passwordInput.errorMessage} onChange={(text) => setPasswordInput(prev => ({...prev, value: text}))}></InputCPN>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                </View>
                <ButtonCPN content='Đăng ký' type='primary' handlePress={() => handleCheckInput() } disable={isSignUp} isLoading={isSignUp} />
            </View>
            <View>
                <View style={styles.linkBar}>
                    <Text>Nếu bạn đã có tài khoản hãy </Text>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate( "(auth)", { screen: "logInScreen" } ) }>
                        <Text style={styles.linkBar_link}>Đăng nhập</Text>
                    </TouchableWithoutFeedback>
                </View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("(auth)", { screen: "otpVerifyScreen",  params: { email: 'nguyenducndm2@gmail.com' } }) }>
                    <Text style={styles.linkBar_link}>Giả sử đăng ký thành công</Text>
                </TouchableWithoutFeedback>
                <View style={styles.linkBar_line}>
                    <Text style={styles.linkBar_line_title}>Lựa chọn khác</Text>
                </View>
            </View>
            <View style={styles.ortherMethodView}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ButtonCPN content='Google' type='cancel' handlePress={() => { }} disable={true} icon={{ name: 'google', size: 22 }} />
                    <ButtonCPN content='Microsoft' type='cancel' handlePress={() => { }} disable={true} icon={{ name: 'microsoft', size: 22 }} />
                </View>
                <Text style={styles.ortherMethodView_commitText}>
                    Chúng tôi đảm bảo an toàn cho các thông tin của bạn cung cấp theo chính sách pháp luật quốc gia của bạn!
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: colorGlobal.backColor,
    },
    viewInput: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        rowGap: 5,
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
