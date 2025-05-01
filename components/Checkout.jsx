import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { COLORS, SIZES, FONT } from '../constants/theme'
import SlidePanel from './SlidePanel'

const { height } = Dimensions.get('window')

const Checkout = ({ isVisible, onClose, total }) => {
    const router = useRouter()
    const opacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (isVisible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start()
        }
    }, [isVisible])

    const handlePlaceOrder = () => {
        // First animate out
        Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            // Close the checkout panel
            onClose();
            // Navigate after a short delay to allow the panel to close
            setTimeout(() => {
                router.push('/screens/CheckoutAccept')
            }, 100)
        })
    }

    return (
        <SlidePanel
            isVisible={isVisible}
            onClose={onClose}
            title={<Text style={styles.headerTitle}>Checkout</Text>}
        >
            <Animated.View style={[styles.content, { opacity }]}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Cost</Text>
                    <Text style={styles.totalAmount}>${total?.toFixed(2)}</Text>
                </View>

                <Text style={styles.termsText}>
                    By placing an order you agree to our {'\n'}
                    Terms And Conditions
                </Text>

                <TouchableOpacity
                    style={styles.placeOrderButton}
                    onPress={handlePlaceOrder}
                >
                    <Text style={styles.placeOrderText}>Place Order</Text>
                </TouchableOpacity>
            </Animated.View>
        </SlidePanel >
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: SIZES.extraLarge - 4,
        fontFamily: FONT.bold,
        color: COLORS.secondary,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.extraLarge,
    },
    totalLabel: {
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
        color: COLORS.secondary,
    },
    totalAmount: {
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
        color: COLORS.primary,
    },
    termsText: {
        textAlign: 'center',
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        color: COLORS.gray,
        marginBottom: SIZES.extraLarge,
    },
    placeOrderButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.medium,
        paddingVertical: SIZES.large,
        alignItems: 'center',
    },
    placeOrderText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
    }
})

export default Checkout
