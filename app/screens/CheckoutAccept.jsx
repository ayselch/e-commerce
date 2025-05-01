import { View, Text, ImageBackground, StyleSheet, SafeAreaView, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { COLORS, SIZES, FONT } from '../../constants/theme'
import { useRouter } from 'expo-router'

const defaultAcceptImage = require('../../assets/images/acceptImage.png');
const defaultBackground = require('../../assets/images/backgroundFinal.jpg');

const CheckoutAccept = () => {
    const router = useRouter()
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start()
    }, [])

    return (
        <ImageBackground
            style={styles.background}
            source={defaultBackground}
            defaultSource={defaultBackground}
            resizeMode='cover'>
            <SafeAreaView style={styles.safeArea}>
                <Animated.View style={[
                    styles.mainContent,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <View style={styles.headerContainer}>
                        <Image
                            style={styles.image}
                            source={defaultAcceptImage}
                            defaultSource={defaultAcceptImage}
                            onError={() => { }}
                        />
                        <Text style={styles.header}>Your Order has been accepted</Text>
                        <Text style={styles.title}>Your items has been placed and is on it's way to being processed</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%' }}>
                        <TouchableOpacity style={styles.trackOrderButton}>
                            <Text style={styles.trackOrderText}>Track Order</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                Animated.parallel([
                                    Animated.timing(fadeAnim, {
                                        toValue: 0,
                                        duration: 200,
                                        useNativeDriver: true,
                                    }),
                                    Animated.timing(slideAnim, {
                                        toValue: 50,
                                        duration: 200,
                                        useNativeDriver: true,
                                    })
                                ]).start(() => router.back())
                            }}
                        >
                            <Text style={styles.backButtonText}>Back to home</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    mainContent: {
        flex: 1,
        padding: SIZES.large,
        alignItems: 'center',
    },
    headerContainer: {
        padding: 20,

    },
    image: {
        width: 160,
        height: 160,
        marginTop: 100,
        alignSelf: 'center',
    },
    header: {
        fontSize: 24,
        fontFamily: FONT.medium,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginTop: 40,
        textAlign: 'center',
    },
    title: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginTop: 20,
        textAlign: 'center',
    },
    trackOrderButton: {
        justifyContent: "flex-end",
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.medium,
        paddingVertical: SIZES.large,
        alignItems: 'center',
        width: '100%',
    },
    trackOrderText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
    },
    backButton: {
        justifyContent: "flex-end",
        backgroundColor: 'transparent',
        borderRadius: SIZES.medium,
        paddingVertical: SIZES.large,
        alignItems: 'center',
        width: '100%',
    },
    backButtonText: {
        color: 'black',
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        fontWeight: 'bold',
    },
})

export default CheckoutAccept