import { View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, Platform } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { groceries } from '../Shop/data'
import ExpoImage from '../../../components/ExpoImage'

const { width } = Dimensions.get('window');

const Search = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text) {
      setSearchResults([]);
      return;
    }

    const results = [];
    groceries.forEach(category => {
      const matchingProducts = category.products?.filter(product =>
        product.name.toLowerCase().startsWith(text.toLowerCase())
      ) || [];

      results.push(...matchingProducts.map(product => ({
        ...product,
        categoryColor: category.color
      })));
    });

    setSearchResults(results);
  };


  const handleCategoryPress = (category) => {
    router.push({
      pathname: '/screens/CategoryDetails',
      params: { category: JSON.stringify(category) }
    })
  }

  const handleProductPress = (product) => {
    router.push({
      pathname: '/screens/ProductDetails',
      params: {
        product: JSON.stringify(product)
      }
    })
  }

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: `${item.color}20`, borderColor: item.color }]}
      onPress={() => handleCategoryPress(item)}
    >
      <ExpoImage
        source={item.img}
        style={styles.categoryImage}
        contentFit="contain"
        contentPosition="center"
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: `${item.categoryColor}20` }]}
      onPress={() => handleProductPress(item)}
    >
      <ExpoImage
        source={typeof item.img === 'string' ? { uri: item.img } : item.img}
        style={styles.productImage}
        contentFit="contain"
        contentPosition="center"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productPieces}>{item.pieces}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Find Products</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name='search' size={23} color="#181B19" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={'#B1B1B1'}
          placeholder='Search Store'
          blurOnSubmit={false}
          keyboardShouldPersistTaps="always"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.closeButton}>
            <FontAwesome name='close' size={16} color="#fff" />
          </TouchableOpacity>
        ) : null}
      </View>

      {searchQuery ? (
        <FlatList
          data={searchResults}
          renderItem={renderProductCard}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No products found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={groceries}
          renderItem={renderCategoryCard}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Gilroy-B',
    color: '#181725',
    letterSpacing: 0.3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F2',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 52,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Gilroy-M',
    color: '#181725',
  },
  closeButton: {
    backgroundColor: '#53B175',
    padding: 8,
    borderRadius: 50,
    marginLeft: 8,
    shadowColor: '#53B175',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 120,
  },
  productCard: {
    width: (width - 50) / 2,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    minHeight: 220,

  },
  productImage: {
    width: '100%',
    height: 110,
    marginBottom: 8,
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Gilroy-B',
    color: '#181725',
    marginBottom: 6,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'Gilroy-B',
    color: '#181725',
    marginBottom: 4,
  },
  productPieces: {
    fontSize: 14,
    fontFamily: 'Gilroy-M',
    color: '#7C7C7C',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Gilroy-M',
    color: '#7C7C7C',
    textAlign: 'center',
  },
  categoryCard: {
    width: (width - 50) / 2,
    height: 200,
    margin: 5,
    borderRadius: 18,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryImage: {
    width: '65%',
    height: '65%',
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Gilroy-B',
    color: '#181725',
    marginTop: 12,
    textAlign: 'center',
  }
});

export default Search