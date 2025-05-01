import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback,
  Keyboard, Animated, Platform, ImageBackground, SafeAreaView,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const defaultIcon = require('../../../assets/images/iconColorful.png');
const defaultBackground = require('../../../assets/images/backgroundFinal.jpg');

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secureText, setSecureText] = useState(true)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const router = useRouter()

  useEffect(() => {
    const fillCredentials = async () => {
      try {
        const lastEmail = await AsyncStorage.getItem('lastRegisteredEmail')
        const lastPassword = await AsyncStorage.getItem('lastRegisteredPassword')
        if (lastEmail) {
          setEmail(lastEmail)
        }
        if (lastPassword) {
          setPassword(lastPassword)
        }
        // Clear the stored credentials after filling
        await AsyncStorage.removeItem('lastRegisteredEmail')
        await AsyncStorage.removeItem('lastRegisteredPassword')
      } catch (error) {
        console.error('Error filling credentials:', error)
      }
    }
    fillCredentials()
  }, [])

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const showAlert = (message) => {
    setAlertMessage(message)
    setAlertVisible(true)
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setAlertVisible(false))
  }

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        showAlert("Please enter email and password")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        showAlert("Please enter a valid email address")
        return
      }

      const storedEmail = await AsyncStorage.getItem('userEmail')
      const storedPassword = await SecureStore.getItemAsync('userPassword')

      if (!storedEmail || email !== storedEmail || password !== storedPassword) {
        showAlert("Invalid email or password")
        return
      }

      await AsyncStorage.setItem('isLoggedIn', 'true')
      router.push('/(tabs)/Shop/Shop')

    } catch (error) {
      console.error("Login error:", error)
      showAlert("Error logging in. Please try again.")
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        {alertVisible && (
          <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
            <Text style={styles.alertText}>{alertMessage}</Text>
          </Animated.View>
        )}
        <KeyboardAwareScrollView
          extraScrollHeight={20}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
              style={styles.backgroundImage}
              resizeMode='cover'
              source={defaultBackground}
              defaultSource={defaultBackground}
            >
              <StatusBar style="dark" />

              <View style={[
                styles.iconContainer,
                keyboardVisible && { paddingVertical: 20 }
              ]}>
                <Image
                  style={styles.icon}
                  source={defaultIcon}
                  defaultSource={defaultIcon}
                  onError={() => { }}
                />
              </View>

              <View style={[
                styles.headerContainer,
                keyboardVisible && { paddingVertical: 10 }
              ]}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.subTitle}>Enter your email and password</Text>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.emailContainer}>
                  <Text style={styles.emailText}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder='Enter your email'
                    placeholderTextColor='#aaa'
                    keyboardType="email-address"
                    style={styles.input}
                  />
                </View>

                <View style={{ width: "100%", height: 1, backgroundColor: '#E2E2E2' }} />

                <View style={[styles.passwordContainer, keyboardVisible && { marginTop: 20 }]}>
                  <Text style={styles.passwordText}>Password</Text>

                  <View>
                    <TextInput
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      placeholder='* * * * * * *'
                      placeholderTextColor='#aaa'
                      secureTextEntry={secureText}
                      style={styles.input}
                    />
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
                </View>

                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>

                <View style={styles.signupConatiner}>
                  <Text style={styles.signUp1}>Don’t have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('../../register/Register')}>
                    <Text style={styles.signUp2}>Signup</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    minHeight: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: "center",
    paddingVertical: 60,
  },
  icon: {
    width: 48,
    height: 55,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    marginBottom: 15,
    fontFamily: 'Gilroy-B',
    fontSize: 25,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Gilroy-M',
    color: "#7C7C7C"
  },
  inputContainer: {
    flex: 1,
    width: '90%',
    alignSelf: "center",
    paddingTop: 20,
  },
  emailContainer: {
    marginBottom: 2,
  },
  emailText: {
    fontSize: 16,
    color: '#7C7C7C',
    fontFamily: 'Gilroy-M'
  },
  input: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Gilroy-M',
    paddingVertical: 8,
    color: '#181725'
  },
  eyeIcon: {
    position: 'absolute',
    right: 5,
    top: 23,
    width: 35,
    height: 20,
  },
  passwordContainer: {
    marginTop: 30,
  },
  passwordText: {
    fontSize: 16,
    color: '#7C7C7C',
    fontFamily: 'Gilroy-M'
  },
  forgotPassword: {
    color: '#181725',
    fontSize: 14,
    fontFamily: 'Gilroy-M',
    textAlign: 'right',
    marginTop: 20
  },
  loginButton: {
    backgroundColor: '#53B175',
    borderRadius: 19,
    paddingVertical: 18,
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Gilroy-B'
  },
  signupConatiner: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  signUp1: {
    fontSize: 14,
    fontFamily: "Gilroy-M",
    color: "#181725",
  },
  signUp2: {
    fontSize: 14,
    fontFamily: "Gilroy-M",
    color: "#53B175",
  },
  alertContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#53B175',
    padding: 15,
    borderRadius: 10,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Gilroy-M',
    fontSize: 16,
  },
})

export default LoginScreen
