import { View, Text, ImageBackground, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { router, useRouter } from 'expo-router';


const { width } = Dimensions.get('window');

const Welcome = () => {
    const router = useRouter()
    const [fontsLoaded] = useFonts({
        'Gilroy-M': require('../../assets/fonts/Gilroy-Medium.ttf'),
        'Gilroy-B': require('../../assets/fonts/Gilroy-Bold.ttf'),
    })
    return (
        <ImageBackground
            source={require('../../assets/images/welcomeBack.png')}
            style={styles.background}
            resizeMode="cover">
            {/* <View style={{backgroundColor:"red", flex:1}}> */}
            <StatusBar style="dark" />
            <View style={styles.emptyContainer} />
            <View style={styles.mainContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/images/nectarIcon.png')} />
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.title}>to our store</Text>
                <Text style={styles.subtitle}>Ger your groceries in as fast as one hour</Text>

                <TouchableOpacity onPress={() => router.push('/(auth)/location/SelectLocation')} style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

            </View>

            {/* </View> */}

        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1, 
    },
    mainContainer: {
        flex: 1, 
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: '100%',
        paddingBottom: 20, 
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 50,
        height: 57,
        marginBottom: 20,
    },
    title: {
        fontSize: 42,
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Gilroy-B',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(252, 252, 252, 0.7)', 
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 40,
        paddingHorizontal: 8,
        fontFamily: 'Gilroy-M',
    },
    button: {
        backgroundColor: '#53B175',
        borderRadius: 25,
        width: '90%',
        paddingVertical: 20, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Gilroy-B',
    },

})


export default Welcome