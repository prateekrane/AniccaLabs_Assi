import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Splash = () => {
    const navigation = useNavigation();
    const [displayText, setDisplayText] = useState('');
    const [letterIndex, setLetterIndex] = useState(0);
    const fullText = 'Anicca Labs';

    useEffect(() => {
        if (letterIndex < fullText.length) {
            const timer = setTimeout(() => {
                setDisplayText(displayText + fullText[letterIndex]);
                setLetterIndex(letterIndex + 1);
            }, 100); // Adjust the timing (100ms) for the speed of the animation

            return () => clearTimeout(timer);
        } else {
            // Navigate to Login screen after the text is fully displayed (and a short delay)
            const timer = setTimeout(() => {
                navigation.navigate('Login');
            }, 1000); // Delay before navigating to Login screen

            return () => clearTimeout(timer);
        }
    }, [letterIndex, displayText, navigation, fullText]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')} // Replace with your logo path
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>
                    {displayText}
                </Text>
            </View>
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333333', // Reddit dark mode background
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF', // Reddit text color
        marginTop: 10,
    },
});