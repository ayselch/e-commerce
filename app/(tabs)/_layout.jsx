import { Tabs } from "expo-router";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Platform, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';

const { height } = Dimensions.get('window');

export default function TabsLayout() {
    const scaleValue = useMemo(() => new Animated.Value(1), []);

    const tabPress = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 70,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    borderTopWidth: 0,
                    zIndex: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                },
                tabBarHideOnKeyboard: true,
                keyboardHidesTabBar: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginBottom: 5,
                },
                tabBarActiveTintColor: '#53B175',
                tabBarInactiveTintColor: '#8e8e93',
                headerShown: false,
                tabBarButton: (props) => {
                    return (
                        <Animated.View
                            style={{
                                flex: 1,
                                transform: [{ scale: scaleValue }],
                            }}
                        >
                            <TouchableOpacity
                                {...props}
                                onPress={(e) => {
                                    tabPress();
                                    props.onPress(e);
                                }}
                            />
                        </Animated.View>
                    );
                },
            }}
        >
            <Tabs.Screen
                name="Shop/Shop"
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ color }) => <MaterialIcons name="store" size={23} color={color} />,
                    unmountOnBlur: true
                }}
            />
            <Tabs.Screen
                name="Search/Search"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <MaterialIcons name='manage-search' size={30} color={color} />,
                    unmountOnBlur: true
                }}
            />
            <Tabs.Screen
                name="Card/Card"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color }) => <Feather name='shopping-cart' size={23} color={color} />,
                    unmountOnBlur: true
                }}
            />
            <Tabs.Screen
                name="Fav/Fav"
                options={{
                    title: 'Favourite',
                    tabBarIcon: ({ color }) => <MaterialIcons name="favorite-border" size={23} color={color} />,
                    unmountOnBlur: true
                }}
            />
            <Tabs.Screen
                name="Profile/Profile"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color }) => <Feather name="user" size={26} color={color} />,
                    unmountOnBlur: true
                }}
            />
        </Tabs>
    )
}