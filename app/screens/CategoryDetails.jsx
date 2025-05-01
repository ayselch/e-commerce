import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, FONT } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../components/CustomAlert';
import ExpoImage from '../../components/ExpoImage';
import Filter from '../../components/Filter';

const CategoryDetails = () => {
    const router = useRouter();
    const { category } = useLocalSearchParams();
    const categoryData = JSON.parse(category);
    const [cartItems, setCartItems] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(categoryData.products);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        priceRange: Math.max(...categoryData.products.map(p => p.price)),
        sortBy: ''
    });
    const filterButtonAnim = useRef(new Animated.Value(1)).current;
    const alertRef = useRef();

    const showAlert = (message) => {
        alertRef.current?.show(message);
    };

    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const savedCart = await AsyncStorage.getItem('cart');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error('Error loading cart items:', error);
            }
        };
        loadCartItems();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [activeFilters]);

    const handleFilterPress = () => {
        Animated.sequence([
            Animated.timing(filterButtonAnim, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(filterButtonAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        setIsFilterVisible(true);
    };

    const applyFilters = () => {
        let filtered = [...categoryData.products];
        filtered = filtered.filter(product => product.price <= activeFilters.priceRange);

        switch (activeFilters.sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const addToCart = async (item) => {
        try {
            const existingCart = await AsyncStorage.getItem('cart');
            let newCart = [];

            if (existingCart) {
                newCart = JSON.parse(existingCart);
                const existingItemIndex = newCart.findIndex(cartItem => cartItem.name === item.name);

                if (existingItemIndex >= 0) {
                    newCart[existingItemIndex].quantity = (newCart[existingItemIndex].quantity || 1) + 1;
                } else {
                    newCart.push({ ...item, id: item.name, quantity: 1 });
                }
            } else {
                newCart = [{ ...item, id: item.name, quantity: 1 }];
            }

            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCartItems(newCart);
            showAlert('Product added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push({
                pathname: './ProductDetails',
                params: { product: JSON.stringify(item) }
            })}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <ExpoImage
                    source={typeof item.img === 'string' ? { uri: item.img } : item.img}
                    style={styles.productImage}
                    contentFit="contain"
                    contentPosition="center"
                />
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPieces}>{item.pieces}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                        }}
                    >
                        <AntDesign name="plus" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const hasActiveFilters =
        activeFilters.priceRange < Math.max(...categoryData.products.map(p => p.price)) ||
        activeFilters.sortBy !== '';

    const getSortLabel = () => {
        switch (activeFilters.sortBy) {
            case 'price-asc':
                return 'Price: Low to High';
            case 'price-desc':
                return 'Price: High to Low';
            case 'name':
                return 'Name: A to Z';
            default:
                return '';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomAlert ref={alertRef} />
            <Filter
                isVisible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onApply={setActiveFilters}
                maxPrice={Math.max(...categoryData.products.map(p => p.price))}
            />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color={COLORS.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{categoryData.name}</Text>
                <Animated.View style={{ transform: [{ scale: filterButtonAnim }] }}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            hasActiveFilters && styles.activeFilterButton
                        ]}
                        onPress={handleFilterPress}
                    >
                        <MaterialCommunityIcons
                            name="filter-variant"
                            size={24}
                            color={hasActiveFilters ? COLORS.white : COLORS.secondary}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {hasActiveFilters && (
                <View style={styles.activeFiltersContainer}>
                    {activeFilters.priceRange < Math.max(...categoryData.products.map(p => p.price)) && (
                        <View style={styles.activeFilterBadge}>
                            <Text style={styles.activeFilterText}>
                                Up to ${Math.round(activeFilters.priceRange)}
                            </Text>
                        </View>
                    )}
                    {activeFilters.sortBy && (
                        <View style={styles.activeFilterBadge}>
                            <Text style={styles.activeFilterText}>
                                {getSortLabel()}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <FlatList
                data={filteredProducts}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.name}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.small,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
        color: COLORS.secondary,
        textAlign: 'center',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.lightGray,
    },
    activeFilterButton: {
        backgroundColor: COLORS.primary,
    },
    activeFiltersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SIZES.small,
        gap: SIZES.base,
    },
    activeFilterBadge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: SIZES.medium,
        paddingVertical: SIZES.base,
        borderRadius: SIZES.medium,
    },
    activeFilterText: {
        color: COLORS.primary,
        fontFamily: FONT.medium,
        fontSize: SIZES.small,
    },
    gridContainer: {
        padding: SIZES.small,
        paddingBottom: SIZES.extraLarge,
    },
    productCard: {
        flex: 1,
        margin: SIZES.base,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    imageContainer: {
        backgroundColor: COLORS.lightGray + '20',
        padding: SIZES.small,
        aspectRatio: 1,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productInfo: {
        padding: SIZES.medium,
    },
    productName: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.secondary,
    },
    productPieces: {
        fontSize: SIZES.small,
        fontFamily: FONT.medium,
        color: COLORS.gray,
        marginTop: SIZES.base / 2,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SIZES.small,
    },
    price: {
        fontSize: SIZES.medium,
        fontFamily: FONT.bold,
        color: COLORS.primary,
    },
    addButton: {
        width: 36,
        height: 36,
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CategoryDetails;