import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

const MyOrders = () => {
    const { orders } = useCart();
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return '#53B175';
            case 'pending':
                return '#F8A44C';
            case 'processing':
                return '#3498db';
            case 'cancelled':
                return '#e74c3c';
            default:
                return '#F8A44C';
        }
    };

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => setExpandedOrderId(expandedOrderId === item.id ? null : item.id)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderDate}>Order Date: {formatDate(item.date)}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
            </View>
            <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>

            {expandedOrderId === item.id && (
                <View style={styles.orderDetails}>
                    <Text style={styles.orderDetailsTitle}>Order Items:</Text>
                    {item.items.map((orderItem) => (
                        <View key={orderItem.id} style={styles.orderItemDetail}>
                            <Text style={styles.itemName}>{orderItem.name}</Text>
                            <Text style={styles.itemQuantity}>x{orderItem.quantity}</Text>
                            <Text style={styles.itemPrice}>${(orderItem.price * orderItem.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>My Orders</Text>
            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No orders yet</Text>
                </View>
            ) : (
                <FlatList
                    data={orders.slice().reverse()} // Show newest orders first
                    renderItem={renderOrderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Gilroy-B',
        color: '#181725',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    listContainer: {
        padding: 20,
    },
    orderItem: {
        backgroundColor: '#F2F3F2',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderDate: {
        fontFamily: 'Gilroy-M',
        fontSize: 16,
        color: '#181725',
    },
    orderStatus: {
        fontFamily: 'Gilroy-B',
        fontSize: 16,
    },
    orderTotal: {
        fontFamily: 'Gilroy-B',
        fontSize: 18,
        color: '#181725',
        marginBottom: 10,
    },
    orderDetails: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E2E2E2',
        paddingTop: 10,
    },
    orderDetailsTitle: {
        fontFamily: 'Gilroy-B',
        fontSize: 16,
        color: '#181725',
        marginBottom: 10,
    },
    orderItemDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        fontFamily: 'Gilroy-M',
        fontSize: 14,
        color: '#181725',
        flex: 1,
    },
    itemQuantity: {
        fontFamily: 'Gilroy-M',
        fontSize: 14,
        color: '#7C7C7C',
        marginHorizontal: 10,
    },
    itemPrice: {
        fontFamily: 'Gilroy-B',
        fontSize: 14,
        color: '#181725',
        minWidth: 70,
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Gilroy-M',
        fontSize: 18,
        color: '#7C7C7C',
    },
});

export default MyOrders;
