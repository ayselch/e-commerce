import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { COLORS, SIZES, FONT } from '../constants/theme';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

const Filter = ({ isVisible, onClose, onApply, maxPrice = 100 }) => {
    const [priceRange, setPriceRange] = useState(maxPrice);
    const [sortBy, setSortBy] = useState('');

    const handleApply = () => {
        onApply({ priceRange, sortBy });
        onClose();
    };

    const SortOption = ({ title, value, icon }) => (
        <TouchableOpacity
            style={[styles.sortOption, sortBy === value && styles.selectedSort]}
            onPress={() => setSortBy(value)}
        >
            <MaterialIcons
                name={icon}
                size={24}
                color={sortBy === value ? COLORS.white : COLORS.secondary}
            />
            <Text style={[
                styles.sortOptionText,
                sortBy === value && styles.selectedSortText
            ]}>
                {title}
            </Text>
            {sortBy === value && (
                <View style={styles.checkmark}>
                    <AntDesign name="check" size={16} color={COLORS.white} />
                </View>
            )}
        </TouchableOpacity>
    );

    if (!isVisible) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={styles.modalOverlay}>
                <Animated.View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color={COLORS.secondary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Filters</Text>
                        <TouchableOpacity onPress={() => {
                            setPriceRange(maxPrice);
                            setSortBy('');
                        }} style={styles.resetButton}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Price Range</Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceLabel}>$0</Text>
                            <Text style={styles.currentPrice}>${Math.round(priceRange)}</Text>
                            <Text style={styles.priceLabel}>${Math.round(maxPrice)}</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={maxPrice}
                            value={priceRange}
                            onSlidingComplete={(value) => setPriceRange(value)}  // daha sabit
                            step={1}
                            minimumTrackTintColor={COLORS.primary}
                            maximumTrackTintColor={COLORS.lightGray}
                            thumbTintColor={COLORS.primary}
                           

                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sort By</Text>
                        <View style={styles.sortOptionsContainer}>
                            <SortOption
                                title="Price: Low to High"
                                value="price-asc"
                                icon="arrow-upward"
                            />
                            <SortOption
                                title="Price: High to Low"
                                value="price-desc"
                                icon="arrow-downward"
                            />
                            <SortOption
                                title="Name: A to Z"
                                value="name"
                                icon="sort-by-alpha"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApply}
                    >
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                </Animated.View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SIZES.extraLarge,
        minHeight: height * 0.7,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.extraLarge,
    },
    closeButton: {
        padding: SIZES.base,
    },
    title: {
        fontSize: SIZES.extraLarge - 4,
        fontFamily: FONT.bold,
        color: COLORS.secondary,
    },
    resetButton: {
        padding: SIZES.base,
    },
    resetText: {
        color: COLORS.primary,
        fontFamily: FONT.medium,
        fontSize: SIZES.medium,
    },
    section: {
        marginBottom: SIZES.extraLarge + 10,
    },
    sectionTitle: {
        fontSize: SIZES.large - 2,
        fontFamily: FONT.bold,
        color: COLORS.secondary,
        marginBottom: SIZES.large,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.base,
    },
    priceLabel: {
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        color: COLORS.gray,
    },
    currentPrice: {
        fontSize: SIZES.large,
        fontFamily: FONT.bold,
        color: COLORS.primary,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sortOptionsContainer: {
        gap: SIZES.medium,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.medium,
        borderRadius: SIZES.medium,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    selectedSort: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    sortOptionText: {
        flex: 1,
        marginLeft: SIZES.medium,
        fontSize: SIZES.medium,
        fontFamily: FONT.medium,
        color: COLORS.secondary,
    },
    selectedSortText: {
        color: COLORS.white,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.large,
        borderRadius: SIZES.medium,
        alignItems: 'center',
        marginTop: 'auto',
    },
    applyButtonText: {
        color: COLORS.white,
        fontSize: SIZES.large - 2,
        fontFamily: FONT.bold,
    },
});

export default Filter;
