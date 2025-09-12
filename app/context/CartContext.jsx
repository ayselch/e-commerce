import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);

    // Load cart and orders from AsyncStorage when app starts
    useEffect(() => {
        loadCartItems();
        loadOrders();
    }, []);

    const loadCartItems = async () => {
        try {
            const savedCart = await AsyncStorage.getItem('cartItems');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const loadOrders = async () => {
        try {
            const savedOrders = await AsyncStorage.getItem('orders');
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const addToCart = (item) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            const newItems = existingItem
                ? prevItems.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
                : [...prevItems, { ...item, quantity: 1 }];
            AsyncStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== itemId);
            AsyncStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            AsyncStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        AsyncStorage.removeItem('cartItems');
    };

    const placeOrder = async () => {
        if (cartItems.length === 0) return null;

        const newOrder = {
            id: Date.now().toString(),
            items: [...cartItems],
            date: new Date().toISOString(),
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'Pending'
        };

        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders, newOrder];
            AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });

        clearCart();
        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders => {
            const updatedOrders = prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            orders,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            placeOrder,
            updateOrderStatus,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;