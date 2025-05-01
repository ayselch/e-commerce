import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

export default function SplashScreen({ onLayout }) {
    return (
        <View style={styles.mainContainer} onLayout={onLayout}>
            <View style={styles.container}>
                <StatusBar style='dark' />
                <Image
                    source={require('../assets/images/nectarIcon.png')}
                    style={styles.icon}
                    resizeMode="contain"
                />
                <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text style={styles.text1}>nectar</Text>
                    <Text style={styles.text2}>online groceries</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#53B175",
        alignItems: 'center',
        justifyContent: "center",
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        marginBottom: 15,
    },
    icon: {
        width: 60,
        height: 67,
        marginRight: 15,
    },
    text1: {
        color: 'white',
        fontFamily: "Gilroy-B",
        fontSize: 53,
    },
    text2: {
        color: 'white',
        fontFamily: "Gilroy-M",
        fontSize: 16,
        paddingHorizontal: 5,
        letterSpacing: 2,
    },
})

