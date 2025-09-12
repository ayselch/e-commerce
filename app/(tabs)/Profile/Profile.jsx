import { View, Text, SafeAreaView, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { MaterialIcons, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import CustomAlert from '../../../components/CustomAlert'
import ExpoImage from '../../../components/ExpoImage'

const defaultProfileImage = require('../../../assets/images/userIcon.png');

const Profile = () => {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: 'User Name',
    email: 'email@example.com',
    profileImage: null
  })
  const alertRef = useRef();

  const showAlert = (message) => {
    alertRef.current?.show(message);
  };

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const [storedName, storedEmail, storedImage] = await Promise.all([
        AsyncStorage.getItem('userName'),
        AsyncStorage.getItem('userEmail'),
        AsyncStorage.getItem('profileImage')
      ])

      setUserData({
        name: storedName || userData.name,
        email: storedEmail || userData.email,
        profileImage: storedImage ? { uri: storedImage } : null
      })
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!granted) {
        showAlert('Permission to access camera roll is required!')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        const imageUri = result.assets[0].uri
        setUserData(prev => ({ ...prev, profileImage: { uri: imageUri } }))
        await AsyncStorage.setItem('profileImage', imageUri)
        showAlert('Profile picture updated successfully!')
      }
    } catch (error) {
      console.error('Error picking image:', error)
      showAlert('Error selecting image')
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn')
      showAlert('Logging out...')
      setTimeout(() => router.push('/(auth)/login/LoginScreen'), 1000)
    } catch (error) {
      console.error('Error logging out:', error)
      showAlert('Error logging out. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert ref={alertRef} />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <ExpoImage
            style={styles.image}
            source={profileImage || defaultProfileImage}
            placeholder={defaultProfileImage}
            contentFit="contain"
            transition={300}
          />
          <View style={styles.editIconContainer}>
            <MaterialIcons name="edit" size={20} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: '#E2E2E2', width: '100%', marginTop: 40 }} />

      <View style={styles.otherContainer}>
        <TouchableOpacity
          style={styles.innerContainers}
          onPress={() => router.push('/screens/MyOrders')}
        >
          <View style={styles.menuItemLeft}>
            <Feather name="shopping-bag" size={24} color="#181725" />
            <Text style={styles.orderText}>My Orders</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#181725" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.innerContainers}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="card-account-details-outline" size={24} color="#181725" />
            <Text style={styles.orderText}>My Details</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#181725" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.innerContainers}>
          <View style={styles.menuItemLeft}>
            <Octicons name="location" size={24} color="#181725" />
            <Text style={styles.orderText}>Delivery Address</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#181725" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 15 : 20,
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginRight: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  editIconContainer: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#53B175',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#181725',
    fontSize: 20,
    fontFamily: 'Gilroy-B',
    marginBottom: 4,
  },
  emailText: {
    color: '#7C7C7C',
    fontSize: 14,
    fontFamily: 'Gilroy-M',
  },
  otherContainer: {
    marginTop: 20,
    width: '100%',
  },
  innerContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#53B175',
    opacity: 0.6,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderText: {
    fontSize: 18,
    fontFamily: 'Gilroy-B',
    color: '#181725',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#53B175',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 30 : 55,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Gilroy-B',
  },
})

export default Profile