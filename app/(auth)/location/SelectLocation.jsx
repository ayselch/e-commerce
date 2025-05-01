import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, Platform, } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import CustomAlert from '../../../components/CustomAlert';

const defaultLocationImg = require('../../../assets/images/locationImg.png');
const defaultBackground = require('../../../assets/images/backgroundFinal.jpg');

const SelectLocation = () => {
    const router = useRouter();
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [countryOpen, setCountryOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const alertRef = useRef();

    const showAlert = (message) => {
        alertRef.current?.show(message);
    };

    const onCountryOpen = () => {
        setCityOpen(false);
    };

    const onCityOpen = () => {
        setCountryOpen(false);
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();
                const countryList = data
                    .map((country) => ({
                        label: country.name.common,
                        value: country.name.common.toLowerCase(),
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setCountries(countryList);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (!selectedCountry) return;
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        country: selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)
                    }),
                });
                const result = await response.json();
                if (result.data) {
                    const cityList = result.data
                        .map((city) => ({
                            label: city,
                            value: city,
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));
                    setCities(cityList);
                }
            } catch (error) {
                console.error(error);
                setCities([]);
            }
        };
        fetchCities();
    }, [selectedCountry]);

    const handleClick = async () => {
        if (selectedCity && selectedCountry) {
            try {
                await AsyncStorage.setItem('selectedCountry', selectedCountry);
                await AsyncStorage.setItem('selectedCity', selectedCity);
                router.push('../login/LoginScreen');
            } catch (error) {
                showAlert('Error saving your location. Please try again.');
            }
        } else {
            showAlert('Please select your country and city before proceeding.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomAlert ref={alertRef} />

            <ImageBackground
                style={{ flex: 1 }}
                resizeMode='cover'
                source={defaultBackground}
                defaultSource={defaultBackground}>
                <StatusBar style="light" />
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    style={styles.backIcon}>
                    <Ionicons name="chevron-back" size={26} color="black" />
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={defaultLocationImg}
                        defaultSource={defaultLocationImg}
                        onError={() => { }}
                    />
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Select Your Location</Text>
                    <Text style={styles.subTitle}>
                        Switch on your location to stay in tune with what’s happening in your area
                    </Text>
                </View>

                <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Your Country</Text>
                    <DropDownPicker
                        open={countryOpen}
                        value={selectedCountry}
                        items={countries}
                        setOpen={setCountryOpen}
                        setValue={setSelectedCountry}
                        setItems={setCountries}
                        placeholder="Select your country"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        textStyle={styles.text}
                        zIndex={2000}
                        zIndexInverse={3000}
                        maxHeight={200}
                        direction="DOWN"
                        onOpen={onCountryOpen}
                    />

                    <Text style={[styles.label, { marginTop: 20 }]}>Your City</Text>

                    <DropDownPicker
                        open={cityOpen}
                        value={selectedCity}
                        items={cities}
                        setOpen={setCityOpen}
                        setValue={setSelectedCity}
                        setItems={setCities}
                        placeholder="Select your city"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        textStyle={styles.text}
                        disabled={!selectedCountry}
                        zIndex={1000}
                        zIndexInverse={4000}
                        maxHeight={200}
                        direction="DOWN"
                        onOpen={onCityOpen}
                    />
                </View>
                <TouchableOpacity onPress={() => handleClick()}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

            </ImageBackground>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingTop: Platform.OS === 'android' ? 30 : 0,

    },
    backIcon: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        marginTop: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 225,
        height: 170,
    },
    titleContainer: {
        marginTop: 40,
        width: '80%',
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
    },
    title: {
        fontFamily: 'Gilroy-B',
        fontSize: 26,
        color: 'black',
    },
    subTitle: {
        marginTop: 10,
        fontFamily: 'Gilroy-M',
        fontSize: 16,
        color: '#7C7C7C',
        textAlign: 'center',
    },
    dropdownWrapper: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Gilroy-M',
        color: '#7C7C7C',
        marginBottom: 5,
    },
    dropdown: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 0,
        paddingHorizontal: 0,
        paddingVertical: 12,
        backgroundColor: 'transparent',
    },
    dropdownContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Gilroy-M',
        color: '#181725',
    },
    button: {
        backgroundColor: '#53B175',
        borderRadius: 25,
        width: '80%',
        paddingVertical: 20,
        marginTop: 50,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Gilroy-B',
    },
});

export default SelectLocation;
