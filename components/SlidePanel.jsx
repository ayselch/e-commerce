import { View, Modal, StyleSheet, Dimensions, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { COLORS } from '../constants/theme';
import { AntDesign } from '@expo/vector-icons';
// import { Portal } from 'react-native-portalize';


const { height } = Dimensions.get('window');

const SlidePanel = ({ isVisible, onClose, children, title }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
    });

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <Animated.View
                            style={[
                                styles.content,
                                {
                                    transform: [{ translateY }],
                                },
                            ]}
                        >
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <AntDesign name="close" size={24} color={COLORS.secondary} />
                                </TouchableOpacity>
                                {title && <View style={styles.headerTitle}>{title}</View>}
                            </View>
                            <View style={styles.childrenContainer}>
                                {children}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        // position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 1000,
        zIndex: 1000,
        marginBottom:0
    },
    content: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: height * 0.4,
        maxHeight: height * 0.9,
        padding: 20,
        elevation: 1000,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    closeButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        alignItems: 'center',
        marginRight: 30,
    },
    childrenContainer: {
        flex: 1,
    },
});

export default SlidePanel;