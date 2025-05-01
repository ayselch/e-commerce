import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import React, { useRef, useState } from 'react';

const CustomAlert = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useImperativeHandle(ref, () => ({
    show: (msg) => {
      setMessage(msg);
      setVisible(true);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    }
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
      <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 2 },
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
});

export default CustomAlert;
