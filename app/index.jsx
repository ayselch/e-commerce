import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from "react-native";
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSplashScreen from '../components/SplashScreen'; // Yalnız bu splash istifadə olunur

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Gilroy-M': require('../assets/fonts/Gilroy-Medium.ttf'),
          'Gilroy-B': require('../assets/fonts/Gilroy-Bold.ttf'),
        });

        // Süni gecikmə: məsələn, 2 saniyə
        await new Promise(resolve => setTimeout(resolve, 2000));

        setFontsLoaded(true);
        await checkAuthStatus();
      } catch (error) {
        console.error('Error during initialization:', error);
        setIsAuthenticated(false);
      }
    }

    prepare();
  }, []);


  const checkAuthStatus = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      setIsAuthenticated(!!userEmail);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  if (!fontsLoaded || isAuthenticated === null) {
    return <CustomSplashScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/Shop/Shop" />;
  }

  return <Redirect href="/(auth)/Welcome" />;
}
