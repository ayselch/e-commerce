import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign, MaterialIcons, Entypo } from 'react-native-vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, FONT } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../components/CustomAlert';
import ExpoImage from '../../components/ExpoImage';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [count, setCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { product } = useLocalSearchParams();
  const productData = JSON.parse(product);
  const alertRef = useRef();

  const showAlert = (message) => {
    alertRef.current?.show(message);
  };

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const existingFav = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
        const isFavorite = existingFav.some(item => item.name === productData.name);
        setIsSelected(isFavorite);
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };
    checkIfFavorite();
  }, [productData.name]);

  const images = (productData.images || [
    productData.img, productData.img, productData.img
  ]).map((img) => ({
    source: typeof img === 'string' ? { uri: img } : img
  }));

  const totalPrice = (productData?.price * count).toFixed(2);

  if (!productData) return null;

  const addToCart = async () => {
    try {
      const existingCart = JSON.parse(await AsyncStorage.getItem('cart')) || [];

      const index = existingCart.findIndex(item => item.name === productData.name);

      if (index >= 0) {
        existingCart[index].quantity = (existingCart[index].quantity || 0) + count;
      } else {
        existingCart.push({ ...productData, id: productData.name, quantity: count });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(existingCart));
      showAlert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToFavorites = async () => {
    try {
      const existingFav = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
      const newIsSelected = !isSelected;
      setIsSelected(newIsSelected);

      if (newIsSelected) {
        // Check if item already exists in favorites
        const existingIndex = existingFav.findIndex(item => item.name === productData.name);
        if (existingIndex === -1) {
          // Only add if not already in favorites
          existingFav.push({ ...productData, id: productData.name });
          await AsyncStorage.setItem('favorites', JSON.stringify(existingFav));
          showAlert('Product added to favorites!');
        }
      } else {
        // Remove from favorites
        const filteredFav = existingFav.filter(item => item.name !== productData.name);
        await AsyncStorage.setItem('favorites', JSON.stringify(filteredFav));
        showAlert('Product removed from favorites!');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${productData.name}!\nPrice: $${productData.price}\n${productData.description}`,
        title: productData.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <CustomAlert ref={alertRef} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Entypo name="share-alternative" size={22} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width}
          height={150}
          autoPlay={true}
          autoPlayInterval={2000}
          data={images}
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
                source={item.source}
                style={styles.carouselImage}
                contentFit="contain"
                contentPosition="center"
              />
            </View>
          )}
        />

        <View style={styles.paginationContainer}>
          {images.map((_, index) => {
            const dotWidth = 8 + (currentIndex === index ? 12 : 0);
            return (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    width: dotWidth,
                    backgroundColor: currentIndex === index ? COLORS.primary : '#E2E2E2',
                  }
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.nameIconContainer}>
          <Text style={styles.productName}>{productData.name}</Text>
          <TouchableOpacity onPress={() => addToFavorites()}>
            {isSelected ?
              <MaterialIcons name="favorite" size={30} color="#53B175" /> :
              <MaterialIcons name="favorite-border" size={30} color="#7C7C7C" />}
          </TouchableOpacity>
        </View>
        <Text style={styles.pieces}>{productData.pieces}</Text>

        <View style={styles.countContainer}>
          <View style={styles.countContainerInner}>
            <TouchableOpacity onPress={() => setCount(count - 1)} disabled={count <= 1}>
              <AntDesign name="minus" size={30} color={count <= 1 ? '#E2E2E2' : '#53B175'} />
            </TouchableOpacity>
            <View style={styles.countTextContainer}>
              <Text style={styles.countText}>{count}</Text>
            </View>
            <TouchableOpacity onPress={() => setCount(count + 1)}>
              <Ionicons name="add" size={30} color="#53B175" />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.price}>${totalPrice}</Text>
          </View>

        </View>

        <View style={{ height: 1, backgroundColor: '#E2E2E2B2', marginTop: 30 }} />

        <View style={styles.detailsContainer2}>
          <Text style={styles.detailsHeader}>Product Detail</Text>
          <Text style={styles.description}>{productData.description}</Text>
        </View>

        <View style={{ height: 1, backgroundColor: '#E2E2E2B2', marginTop: 30 }} />

        <View style={styles.nutritionContainer}>
          <Text style={styles.detailsHeader}> Nutritions</Text>
          <Text style={styles.description}>{productData.pieces}</Text>
        </View>

        <View style={{ height: 1, backgroundColor: '#E2E2E2B2', marginTop: 30 }} />

        <View style={styles.addButonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={addToCart}
          >
            <Text style={styles.addButtonText}>Add To Basket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SIZES.base,
    marginTop: SIZES.base,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    marginTop: SIZES.large,
    height: 150,
  },
  carouselItem: {
    flex: 1,
    borderRadius: SIZES.medium,
    overflow: 'hidden',
    marginHorizontal: SIZES.large,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.base
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
    // alignSelf: 'center'
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.base,
  },
  paginationDot: {
    height: SIZES.base,
    borderRadius: SIZES.base / 2,
    marginHorizontal: SIZES.base / 2,
  },
  detailsContainer: {
    marginTop: SIZES.large,
    paddingHorizontal: SIZES.large,
  },
  nameIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONT.bold,
    color: COLORS.secondary,
  },
  pieces: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: SIZES.base,
    fontFamily: FONT.medium,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  countContainerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 150
  },
  countTextContainer: {
    width: 50,
    height: 50,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: SIZES.large,
    color: COLORS.secondary,
    fontFamily: FONT.bold,
  },
  price: {
    fontSize: SIZES.large + 2,
    color: COLORS.secondary,
    fontFamily: FONT.bold,
    marginTop: SIZES.base,
  },
  detailsContainer2: {
    marginTop: SIZES.extraLarge,
    width: '100%',
  },
  detailsHeader: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  description: {
    fontSize: SIZES.small + 1,
    color: COLORS.gray,
    marginTop: SIZES.base,
    fontFamily: FONT.medium,
  },
  nutritionContainer: {
    marginTop: SIZES.large,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButonContainer: {
    marginTop: SIZES.extraLarge,
    marginBottom: SIZES.small,
    width: '100%',
    alignItems: 'center',
  },
  addButton: {
    width: '90%',
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: SIZES.medium + 2,
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
});

export default ProductDetails;
