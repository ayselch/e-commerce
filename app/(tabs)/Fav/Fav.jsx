import { View, Text, SafeAreaView, Platform, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import ExpoImage from '../../../components/ExpoImage'
import Checkout from '../../../components/Checkout'
import CustomAlert from '../../../components/CustomAlert'
import { styles } from './styles'

const Fav = () => {
  const [favItems, setFavItems] = React.useState([])
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false)
  const alertRef = React.useRef()

  const showAlert = (message) => {
    alertRef.current?.show(message)
  }

  const total = favItems.reduce((sum, item) => sum + item.price, 0)

  const removeFromFavorites = async (itemName) => {
    try {
      const updatedFavItems = favItems.filter(item => item.name !== itemName)
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavItems))
      setFavItems(updatedFavItems)
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
  }

  const loadFavItems = async () => {
    try {
      const savedFav = await AsyncStorage.getItem('favorites')
      if (savedFav) {
        const items = JSON.parse(savedFav)
        setFavItems(items)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const addAllToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart')
      let newCart = existingCart ? JSON.parse(existingCart) : []

      // Add each favorite item to cart
      for (const item of favItems) {
        const existingItemIndex = newCart.findIndex(cartItem => cartItem.name === item.name)

        if (existingItemIndex >= 0) {
          // If item exists, increment quantity
          newCart[existingItemIndex].quantity = (newCart[existingItemIndex].quantity || 1) + 1
        } else {
          // If item doesn't exist, add it with quantity 1
          newCart.push({ ...item, id: item.name, quantity: 1 })
        }
      }

      await AsyncStorage.setItem('cart', JSON.stringify(newCart))
      showAlert('All items added to cart!')
    } catch (error) {
      console.error('Error adding items to cart:', error)
      showAlert('Failed to add items to cart')
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavItems()
    }, [])
  )

  const renderFavItem = ({ item }) => {
    return (
      <View style={styles.cartItem}>
        <View style={styles.leftContainer}>
          <ExpoImage
            source={typeof item.img === 'string' ? { uri: item.img } : item.img}
            style={styles.itemImage}
            contentFit="contain"
            contentPosition="center"
          />

          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPieces}>{item.pieces}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => removeFromFavorites(item.name)}
          >
            <AntDesign name="delete" size={24} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert ref={alertRef} />
      <Text style={styles.headerText}>Favorite</Text>
      <View style={styles.divider} />

      {favItems.length > 0 ? (
        <>
          <FlatList
            data={favItems}
            renderItem={renderFavItem}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={addAllToCart}
            >
              <Text style={styles.totalText}>Add All To Cart</Text>
              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items in your favorites</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Fav
