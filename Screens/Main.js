import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Main = ({ navigation }) => {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('user_id');
        navigation.replace('Login');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#181A1B',
    },
    title: {
        fontSize: 24,
        color: '#00FF84',
        marginBottom: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#00FF84',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: '#181A1B',
        fontSize: 16,
        fontWeight: 'bold',
    },
})