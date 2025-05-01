import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import ExpoImage from '../../../components/ExpoImage'
import CustomAlert from '../../../components/CustomAlert'
import Checkout from '../../../components/Checkout'

const Card = () => {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false)
  const alertRef = useRef()

  const loadCartItems = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart')
      if (savedCart) {
        const items = JSON.parse(savedCart)
        setCartItems(items)
        calculateTotal(items)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadCartItems()
    }, [])
  )

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      return acc + (item.price * (item.quantity || 1))
    }, 0)
    setTotal(sum)
  }

  const updateItemQuantity = async (itemId, increment) => {
    const updatedCart = cartItems.map(item => {
      if (item.name === itemId) {
        const newQuantity = (item.quantity || 1) + (increment ? 1 : -1)
        if (newQuantity < 1) return null
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean)

    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart))
      setCartItems(updatedCart)
      calculateTotal(updatedCart)
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const removeItem = async (itemId) => {
    const updatedCart = cartItems.filter(item => item.name !== itemId)
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart))
      setCartItems(updatedCart)
      calculateTotal(updatedCart)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <ExpoImage
        style={styles.itemImage}
        source={typeof item.img === 'string' ? { uri: item.img } : item.img}
        contentFit="contain"
        contentPosition="center"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPieces}>{item.pieces}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.name, false)}
          >
            <AntDesign name="minus" size={20} color="#53B175" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.name, true)}
          >
            <AntDesign name="plus" size={20} color="#53B175" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeItem(item.name)}
        >
          <AntDesign name="close" size={20} color="#FF0000" />
        </TouchableOpacity>
        <Text style={styles.itemPrice}>${(item.price * (item.quantity || 1)).toFixed(2)}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert ref={alertRef} />
      <Checkout
        isVisible={isCheckoutVisible}
        onClose={() => setIsCheckoutVisible(false)}
        total={total}
      />
      <Text style={styles.headerText}>My Cart</Text>
      <View style={{ height: 1, backgroundColor: '#E2E2E2', marginBottom: 20 }} />

      {cartItems.length > 0 ? (
        <>
          <View style={{ flex: 1 }}>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={item => item.name}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.totalMainContainer}>
            <TouchableOpacity
              style={styles.totalContainer}
              onPress={() => setIsCheckoutVisible(true)}
            >
              <Text style={styles.totalText}>Go to Checkout</Text>
              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      )}
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Gilroy-B',
    color: '#181725',
    marginBottom: 20,
    alignSelf: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Gilroy-B',
    color: '#181725',
  },
  itemPieces: {
    fontSize: 14,
    fontFamily: 'Gilroy-M',
    color: '#7C7C7C',
    marginTop: 5,
    marginBottom: 10,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  deleteButton: {
    padding: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Gilroy-B',
    color: '#181725',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#F2F3F2',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Gilroy-M',
    marginHorizontal: 15,
  },
  totalMainContainer: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    // borderTopWidth: 1,
    // borderColor: '#E2E2E2',
  },

  totalContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#53B175',
    marginBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  totalText: {
    fontSize: 18,
    fontFamily: 'Gilroy-B',
    color: 'white',
  },
  totalAmountContainer: {
    backgroundColor: '#489E67',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'Gilroy-B',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Gilroy-M',
    color: '#7C7C7C',
  },
})

export default Card
