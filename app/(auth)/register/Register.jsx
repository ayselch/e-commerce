import React, { useState, useRef, useEffect } from 'react';
import {
    KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, Image,
    TouchableOpacity, View, SafeAreaView, TouchableWithoutFeedback, Keyboard,
    ImageBackground, TextInput, ActivityIndicator, Animated,
    Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import CustomAlert from '../../../components/CustomAlert'
import { useRouter } from 'expo-router';

const ValidationItem = ({ isValid, text }) => (
    <View style={styles.validationItemContainer}>
        <View style={[styles.checkCircle, isValid && styles.validCheckCircle]}>
            {isValid && <EntypoIcon name="check" size={12} color="#fff" />}
        </View>
        <Text style={[styles.validationText, isValid && styles.validText]}>{text}</Text>
    </View>
);

const RegisterScreen = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secureText, setSecureText] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const alertRef = useRef();

    const showAlert = (message) => {
      alertRef.current?.show(message);
    };

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [shouldShowValidation, setShouldShowValidation] = useState(false);

    useEffect(() => {
        validatePassword(password);
    }, [password]);

    useEffect(() => {
        const allRequirementsMet = Object.values(validations).every(Boolean);
        if (allRequirementsMet && isPasswordFocused) {
            const timer = setTimeout(() => {
                setShouldShowValidation(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [validations, isPasswordFocused]);

    const validatePassword = (pass) => {
        setValidations({
            length: pass.length >= 8,
            uppercase: /[A-Z]/.test(pass),
            lowercase: /[a-z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
        });
    };

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            name: '',
            email: '',
            password: ''
        }

        if (name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters long'
            isValid = false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        if (!Object.values(validations).every(Boolean)) {
            newErrors.password = 'Password does not meet all requirements';
            isValid = false;
        }

        setErrors(newErrors)
        return isValid
    }

   
    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true)
        try {
            await AsyncStorage.setItem('userName', name);
            await AsyncStorage.setItem('userEmail', email);
            await SecureStore.setItemAsync('userPassword', password);
            // Store last registered user credentials temporarily
            await AsyncStorage.setItem('lastRegisteredEmail', email);
            await AsyncStorage.setItem('lastRegisteredPassword', password);
            router.push('../login/LoginScreen')
        } catch (error) {
            showAlert("Account can't be created correctly")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordFocus = () => {
        setIsPasswordFocused(true);
        setShouldShowValidation(true);
    };

    const handlePasswordBlur = () => {
        setIsPasswordFocused(false);
        const allRequirementsMet = Object.values(validations).every(Boolean);
        if (!allRequirementsMet) {
            setShouldShowValidation(false);
        }
    };

    const renderError = (error) => {
        if (error) {
            return <Text style={styles.errorText}>{error}</Text>
        }
        return null
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ImageBackground
                    style={{ flex: 1 }}
                    source={require('../../../assets/images/backgroundFinal.jpg')}
                    resizeMode='cover'
                >
                    <StatusBar style="dark" />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{
                                flexGrow: 0,
                                paddingBottom: Platform.OS === 'ios' ? 20 : 10
                            }}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            <CustomAlert ref={alertRef} />
                            <View style={styles.mainContainer}>
                                <View style={styles.iconContainer}>
                                    <Image style={styles.icon}
                                        source={require('../../../assets/images/iconColorful.png')} />
                                </View>

                                <View style={styles.headerContainer}>
                                    <Text style={styles.title}>Sign Up</Text>
                                    <Text style={styles.subTitle}>Enter your credentials to continue</Text>
                                </View>

                                <View style={styles.inputContainer}>
                                    <View style={styles.emailContainer}>
                                        <Text style={styles.inputText}>Username</Text>
                                        <TextInput
                                            value={name}
                                            placeholder='Enter your name'
                                            placeholderTextColor='#aaa'

                                            onChangeText={(text) => {
                                                setName(text)
                                                if (errors.name) setErrors({ ...errors, name: '' })
                                            }}
                                            style={[styles.input, errors.name ? styles.inputError : null]}
                                        />
                                        {renderError(errors.name)}
                                    </View>

                                    <View style={styles.separator} />

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputText}>Email</Text>
                                        <TextInput
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text)
                                                if (errors.email) setErrors({ ...errors, email: '' })
                                            }}
                                            placeholder='Enter your email'
                                            placeholderTextColor='#aaa'

                                            keyboardType="email-address"
                                            style={[styles.input, errors.email ? styles.inputError : null]}
                                        />
                                        {renderError(errors.email)}
                                    </View>

                                    <View style={styles.separator} />

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputText}>Password</Text>
                                        <View>
                                            <TextInput
                                                value={password}
                                                onChangeText={(text) => {
                                                    setPassword(text);
                                                    if (errors.password) setErrors({ ...errors, password: '' });
                                                }}
                                                placeholder='* * * * * * *'
                                                placeholderTextColor='#aaa'
                                                secureTextEntry={secureText}
                                                style={[styles.input, errors.password ? styles.inputError : null]}
                                                onFocus={handlePasswordFocus}
                                                onBlur={handlePasswordBlur}
                                            />
                                            {renderError(errors.password)}
                                            <TouchableOpacity
                                                style={styles.eyeIcon}
                                                onPress={() => setSecureText(!secureText)}
                                            >
                                                {secureText ? (
                                                    <EntypoIcon size={17} name="eye" color="#000" />
                                                ) : (
                                                    <EntypoIcon size={17} name="eye-with-line" color="#000" />
                                                )}
                                            </TouchableOpacity>
                                        </View>

                                        {shouldShowValidation && (
                                            <View style={styles.validationContainer}>
                                                <Text style={styles.validationTitle}>Password Requirements:</Text>
                                                <View style={styles.requirementsList}>
                                                    <ValidationItem
                                                        isValid={validations.length}
                                                        text="At least 8 characters"
                                                    />
                                                    <ValidationItem
                                                        isValid={validations.uppercase}
                                                        text="Uppercase letter"
                                                    />
                                                    <ValidationItem
                                                        isValid={validations.lowercase}
                                                        text="Lowercase letter"
                                                    />
                                                    <ValidationItem
                                                        isValid={validations.number}
                                                        text="Number"
                                                    />
                                                    <ValidationItem
                                                        isValid={validations.special}
                                                        text="Special character"
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.separator} />

                                    <Text style={styles.endText}>
                                        By continuing you agree to our{' '}
                                        <Text
                                            style={styles.linkText}
                                            onPress={() => Linking.openURL('https://www.termsfeed.com/live/f82b6467-508d-4fe3-8bf0-35cc7db7530a')}
                                        >
                                            Terms of Service
                                        </Text>
                                        {' '}and{' '}
                                        <Text
                                            style={styles.linkText}
                                            onPress={() => Linking.openURL('https://www.termsfeed.com/live/f82b6467-508d-4fe3-8bf0-35cc7db7530a')}
                                        >
                                            Privacy Policy
                                        </Text>
                                    </Text>

                                    <TouchableOpacity
                                        style={[styles.loginButton, isLoading && styles.disabledButton]}
                                        onPress={handleRegister}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#FFF" />
                                        ) : (
                                            <Text style={styles.loginButtonText}>Sign Up</Text>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.signupContainer}>
                                        <Text style={styles.signUp1}>Already have an account?  </Text>
                                        <TouchableOpacity onPress={() => router.push('../../login/LoginScreen')}>
                                            <Text style={styles.signUp2}>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>

                </ImageBackground>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 30
    },
    icon: {
        width: 48,
        height: 55,
        resizeMode: 'contain'
    },
    headerContainer: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginBottom: 10
    },
    title: {
        marginBottom: 8,
        fontFamily: 'Gilroy-B',
        fontSize: 28,
        color: '#181725'
    },
    subTitle: {
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: "#7C7C7C",
        lineHeight: 24
    },
    inputContainer: {
        width: '90%',
        justifyContent: "center",
        alignSelf: "center",
        paddingHorizontal: 5,
        marginTop: 10
    },
    emailContainer: {
        marginBottom: 2
    },
    inputText: {
        fontSize: 16,
        color: '#7C7C7C',
        fontFamily: 'Gilroy-M'
    },
    input: {
        marginTop: 8,
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        paddingVertical: 10,
        color: '#181725'
    },
    inputError: {
        borderColor: '#FF4B4B',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 75, 75, 0.05)'
    },
    errorText: {
        color: '#FF4B4B',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Gilroy-M'
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 20,
        width: 35,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputGroup: {
        marginTop: 20
    },
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: '#E2E2E2',
        marginVertical: 12
    },
    endText: {
        fontSize: 12,
        fontFamily: 'Gilroy-M',
        color: "#7C7C7C",
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 15,
        paddingHorizontal: 20
    },
    linkText: {
        color: '#53B175',
        textDecorationLine: 'underline',
        fontFamily: 'Gilroy-B'
    },
    loginButton: {
        backgroundColor: '#53B175',
        borderRadius: 20,
        paddingVertical: 18,
        marginTop: 25,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#53B175',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Gilroy-B',
        letterSpacing: 0.5
    },
    disabledButton: {
        backgroundColor: '#A5D6A7',
        shadowOpacity: 0
    },
    signupContainer: {
        marginTop: 20,
        marginBottom: Platform.OS === 'ios' ? 30 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    signUp1: {
        fontSize: 15,
        fontFamily: "Gilroy-M",
        color: "#181725"
    },
    signUp2: {
        fontSize: 15,
        fontFamily: "Gilroy-B",
        color: "#53B175"
    },
    alertContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: '#53B175',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    alertText: {
        color: '#FFF',
        fontSize: 15,
        fontFamily: 'Gilroy-B',
        textAlign: 'center'
    },
    validationContainer: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#53B175',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 5,
        zIndex: 1000,
    },
    validationTitle: {
        fontSize: 14,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginBottom: 5,
    },
    requirementsList: {
        marginTop: 5,
    },
    validationItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    checkCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    validCheckCircle: {
        backgroundColor: '#53B175',
        borderColor: '#53B175',
    },
    validationText: {
        fontSize: 12,
        fontFamily: 'Gilroy-M',
        color: 'white',
    },
    validText: {
        color: '#53B175',
    },
});

export default RegisterScreen;