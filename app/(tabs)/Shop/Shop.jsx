import {
  View, Text, Keyboard, SafeAreaView, FlatList, TextInput, Dimensions,
  TouchableOpacity, ScrollView, Image
} from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Carousel from 'react-native-reanimated-carousel';
import { fruits, vegetables, groceries, meats } from './data'
import { useRouter } from 'expo-router'
import ExpoImage from '../../../components/ExpoImage'
import CustomAlert from '../../../components/CustomAlert'
import { styles } from './styles'

const { width } = Dimensions.get('window');

const bannerData = [
  {
    id: 1,
    image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoJZOELkD22Nb7HFdAbLxSdSrzYA4Jnb2raA&s' }
  },
  {
    id: 2,
    image: { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHV_Y3aMTapyi_R43Gk8YyuiCc4xaG5-HS3g&s' }
  },
  {
    id: 3,
    image: { uri: 'https://media.istockphoto.com/id/589415708/photo/fresh-fruits-and-vegetables.jpg?s=612x612&w=0&k=20&c=aBFGUU-98pnoht73co8r2TZIKF3MDtBBu9KSxtxK_C0=' }
  }
];

const Shop = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [location, setLocation] = useState({
    country: '',
    city: ''
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const alertRef = useRef();
  const debouncedSearchRef = useRef();


  const showAlert = (message) => {
    alertRef.current?.show(message);
  };

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current);
    }

    debouncedSearchRef.current = setTimeout(() => {
      if (!text) {
        setSearchResults([]);
        return;
      }

      const allCategories = [...fruits, ...vegetables, ...meats];
      const allProductsFromGroceries = groceries.flatMap(category => {
        return category.products?.map(product => ({
          ...product,
          categoryColor: category.color,
          categoryName: category.name
        })) || [];
      });

      const allProducts = [...allCategories, ...allProductsFromGroceries];

      const matchedCategories = groceries.filter(category =>
        category.name.toLowerCase().startsWith(text.toLowerCase())
      ).map((category, index) => ({
        ...category,
        type: 'category',
        id: category.name || index
      }));

      const matchedProducts = allProducts.filter(product =>
        product.name.toLowerCase().startsWith(text.toLowerCase())
      ).map((product, index) => ({
        ...product,
        id: product.id || product.name || index
      }));

      const searchResults = [...matchedCategories, ...matchedProducts];

      setSearchResults(searchResults);
    }, 300);
  }, []);



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
      setCartItems(newCart)
      showAlert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  useEffect(() => {
    const getLocation = async () => {
      try {
        const country = await AsyncStorage.getItem('selectedCountry')
        const city = await AsyncStorage.getItem('selectedCity')
        setLocation({
          country: country || '',
          city: city || ''
        })
      } catch (error) {
        console.error('Error fetching location:', error)
      }
    }

    getLocation()
  }, [])

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error('Error loading cart items:', error)
      }
    }

    loadCartItems()
  }, [])

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
      // transition={100}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <CustomAlert ref={alertRef} />
        <StatusBar style="dark" />

        {searchQuery ? (
          <>
            {/* Header */}
            <View style={styles.header}>
              <ExpoImage
                style={styles.icon}
                source={require('../../../assets/images/iconColorful.png')}
                transition={100}
              />
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={24} color="#53B175" />
                <Text style={styles.locationText}>
                  {location.city}, {location.country}
                </Text>
              </View>
            </View>

            {/* Search section */}
            <View style={styles.mainContainer}>
              <View style={styles.inputWrapper}>
                <AntDesign name='search1' size={23} color="#7C7C7C" />
                <TextInput
                  placeholderTextColor={'#7C7C7C'}
                  placeholder='Search Store'
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="search"
                  onSubmitEditing={() => { }}
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps="always"
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => handleSearch('')} style={styles.closeButton}>
                    <FontAwesome name='close' size={16} color="#fff" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {searchResults.some(item => item.type === 'category') && (

              <View style={styles.searchCategoriesContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.searchCategoriesContent}
                >
                  {searchResults.filter(item => item.type === 'category').map((item, index) => (
                    <View key={item.id || index} style={styles.searchCategoryItem}>
                      {renderGroceryCategory({ item })}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <FlatList
              data={searchResults.filter(item => !item.type)}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.flatListContentContainer}
              initialNumToRender={6}
              maxToRenderPerBatch={8}
              windowSize={10}
              removeClippedSubviews={true}
              numColumns={2}
              renderItem={({ item }) => renderProductCard({ item })}
              keyboardShouldPersistTaps="always"
              onScrollBeginDrag={Keyboard.dismiss}
            />
          </>
        ) : (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            enableOnAndroid
            enableAutomaticScroll
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <ExpoImage
                style={styles.icon}
                source={require('../../../assets/images/iconColorful.png')}
                transition={100}
              />
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={24} color="#53B175" />
                <Text style={styles.locationText}>
                  {location.city}, {location.country}
                </Text>
              </View>
            </View>

            {/* Search section */}
            <View style={styles.mainContainer}>
              <View style={styles.inputWrapper}>
                <AntDesign name='search1' size={23} color="#7C7C7C" />
                <TextInput
                  placeholderTextColor={'#7C7C7C'}
                  placeholder='Search Store'
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="search"
                  onSubmitEditing={() => { }}
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps="always"
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => handleSearch('')} style={styles.closeButton}>
                    <FontAwesome name='close' size={16} color="#fff" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Carousel section */}
            <View style={styles.carouselContainer}>
              <Carousel
                loop
                width={width}
                height={140}
                autoPlay={true}
                autoPlayInterval={2000}
                pauseOnTouch={false}
                data={bannerData}
                scrollAnimationDuration={1000}
                onProgressChange={(_, absoluteProgress) => {
                  const index = Math.round(absoluteProgress);
                  if (index !== currentIndex) {
                    setCurrentIndex(index);
                  }
                }}
                renderItem={({ item }) => (
                  <View style={styles.carouselItem}>
                    <ExpoImage
                      source={item.image}
                      style={styles.carouselImage}
                      resizeMode="cover"
                      transition={100}
                    />
                  </View>
                )}
              />

              <View style={styles.paginationContainer}>
                {bannerData.map((_, index) => {
                  const width = 8 + (currentIndex === index ? 12 : 0);
                  return (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        {
                          width,
                          backgroundColor: currentIndex === index ? '#53B175' : '#E2E2E2',
                        }
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            {/* Product sections */}
            {/* Exclusive Offer */}
            <View style={styles.firstContainer}>
              <View style={styles.firstContainerHeader}>
                <Text style={styles.headerText}>Exclusive Offer</Text>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => router.push({
                    pathname: '/screens/SeeAll',
                    params: {
                      title: 'Exclusive Offer',
                      data: JSON.stringify(fruits)
                    }
                  })}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={fruits}
                renderItem={renderProductCard}
                keyExtractor={(item, index) => item.id?.toString() || item.name || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContentContainer}
                initialNumToRender={6}
                maxToRenderPerBatch={8}
                windowSize={10}
                removeClippedSubviews={true}
              />

            </View>

            {/* Best Selling */}
            <View style={styles.firstContainer}>
              <View style={styles.firstContainerHeader}>
                <Text style={styles.headerText}>Best Selling</Text>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => router.push({
                    pathname: '/screens/SeeAll',
                    params: {
                      title: 'Best Selling',
                      data: JSON.stringify(vegetables)
                    }
                  })}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={vegetables}
                renderItem={renderProductCard}
                keyExtractor={(item, index) => item.id?.toString() || item.name || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContentContainer}
                initialNumToRender={6}
                maxToRenderPerBatch={8}
                windowSize={10}
                removeClippedSubviews={true}

              />
            </View>

            {/* Groceries */}
            <View style={styles.firstContainer}>
              <View style={styles.firstContainerHeader}>
                <Text style={styles.headerText}>Groceries</Text>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => router.push({
                    pathname: '/screens/SeeAll',
                    params: {
                      title: 'Groceries',
                      data: JSON.stringify(groceries)
                    }
                  })}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={groceries}
                renderItem={renderGroceryCategory}
                keyExtractor={(item, index) => item.id?.toString() || item.name || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContentContainer}
                initialNumToRender={6}
                maxToRenderPerBatch={8}
                windowSize={10}
                removeClippedSubviews={true}

              />
            </View>

            {/* Meats */}
            <View style={styles.firstContainer}>
              <View style={styles.firstContainerHeader}>
                <Text style={styles.headerText}>Meats</Text>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => router.push({
                    pathname: '/screens/SeeAll',
                    params: {
                      title: 'Meats',
                      data: JSON.stringify(meats)
                    }
                  })}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={meats}
                renderItem={renderProductCard}
                keyExtractor={(item, index) => item.id?.toString() || item.name || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContentContainer}
                initialNumToRender={6}
                maxToRenderPerBatch={8}
                windowSize={10}
                removeClippedSubviews={true}

              />
            </View>
          </KeyboardAwareScrollView>
        )}
      </View>
    </SafeAreaView >
  )
}

export default Shop