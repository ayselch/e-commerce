import { View, Text, SafeAreaView, StyleSheet, Platform, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { MaterialIcons, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import CustomAlert from '../../../components/CustomAlert'

const Profile = () => {
  const router = useRouter()
  const [userName, setUserName] = useState('User Name')
  const [userEmail, setUserEmail] = useState('email@example.com')
  const [profileImage, setProfileImage] = useState('https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small_2x/simple-user-default-icon-free-png.png')
  const alertRef = useRef();

  const showAlert = (message) => {
    alertRef.current?.show(message);
  };

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName')
      const storedEmail = await AsyncStorage.getItem('userEmail')
      const storedImage = await AsyncStorage.getItem('profileImage')

      if (storedName) setUserName(storedName)
      if (storedEmail) setUserEmail(storedEmail)
      if (storedImage) setProfileImage(storedImage)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
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
        setProfileImage(imageUri)
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
      setTimeout(() => {
        router.push('/(auth)/login/LoginScreen')
      }, 1000)
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
          <Image style={styles.image} source={{ uri: profileImage }} />
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
        <TouchableOpacity style={styles.innerContainers}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="shopping-bag" size={24} color="#181725" />
            <Text style={styles.orderText}>My Orders</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#181725" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.innerContainers}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="card-account-details-outline" size={24} color="#181725" />
            <Text style={styles.orderText}>My Details</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#181725" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.innerContainers}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Octicons name="location" size={24} color="#181725" />
            <Text style={styles.orderText}>Delivery Address</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#181725" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  editIconContainer: {
    position: 'absolute',
    right: 18,
    bottom: 0,
    backgroundColor: '#53B175',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    // padding: 20,
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
    paddingHorizontal: 10,
    width: '100%',
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
  alertContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    backgroundColor: '#53B175',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  alertText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Gilroy-B',
    textAlign: 'center',
  },
})

export default Profile