import {
    View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions,Platform,
    TouchableOpacity, Image
} from 'react-native'
import React, { useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { COLORS, SIZES } from '../../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomAlert from '../../components/CustomAlert'

const { width } = Dimensions.get('window')

const SeeAll = () => {
    const router = useRouter()
    const { title, data } = useLocalSearchParams()
    const items = JSON.parse(data)
    const alertRef = useRef()

    const showAlert = (message) => {
        alertRef.current?.show(message)
    }

    const addToCart = async (item) => {
        try {
            const existingCart = await AsyncStorage.getItem('cart')
            let newCart = []

            if (existingCart) {
                newCart = JSON.parse(existingCart)
                const existingItemIndex = newCart.findIndex(cartItem => cartItem.name === item.name)

                if (existingItemIndex >= 0) {
                    newCart[existingItemIndex].quantity = (newCart[existingItemIndex].quantity || 1) + 1
                } else {
                    newCart.push({ ...item, id: item.name, quantity: 1 })
                }
            } else {
                newCart = [{ ...item, id: item.name, quantity: 1 }]
            }

            await AsyncStorage.setItem('cart', JSON.stringify(newCart))
            showAlert('Product added to cart!')
        } catch (error) {
            console.error('Error adding to cart:', error)
        }
    }

    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push({
                pathname: '/screens/ProductDetails',
                params: { product: JSON.stringify(item) }
            })}
        >
            <Image
                style={styles.productImage}
                source={typeof item.img === 'string' ? { uri: item.img } : item.img}
            />

            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPieces}>{item.pieces}</Text>

            <View style={styles.productPriceContainer}>
                <Text style={styles.productPrice}>${item.price}</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        requestAnimationFrame(() => addToCart(item))
                    }}
                >
                    <AntDesign name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )

    const renderGroceryCategory = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryCard, { backgroundColor: `${item.color}30` }]}
            onPress={() => router.push({
                pathname: '/screens/CategoryDetails',
                params: { category: JSON.stringify(item) }
            })}
        >
            <Image
                source={typeof item.img === 'string' ? { uri: item.img } : item.img}
                style={styles.categoryImage}
            />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <CustomAlert ref={alertRef} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={items}
                renderItem={title === 'Groceries' ? renderGroceryCategory : renderProductCard}
                keyExtractor={(item, index) => item.id?.toString() || item.name || index.toString()}
                numColumns={title === 'Groceries' ? 1 : 2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContentContainer}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? 30 : 0,

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Gilroy-B',
        color: '#181725',
    },
    flatListContentContainer: {
        padding: 10,
    },
    productCard: {
        width: (width - 40) / 2,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        minHeight: 230,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E2E2',
    },
    productImage: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 5,
    },
    productName: {
        fontSize: 16,
        color: '#181725',
        fontFamily: 'Gilroy-B',
        marginTop: 8,
        paddingHorizontal: 2,
    },
    productPieces: {
        fontSize: 14,
        fontFamily: 'Gilroy-M',
        color: '#7C7C7C',
        marginTop: 4,
        paddingHorizontal: 2,
    },
    productPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    productPrice: {
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: '#181725',
    },
    addButton: {
        backgroundColor: "#53B175",
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
    },
    categoryCard: {
        width: width - 40,
        height: 100,
        marginVertical: 8,
        padding: 15,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    categoryImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    categoryName: {
        fontSize: 16,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginLeft: 15,
        flex: 1,
    },
})

export default SeeAll