import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { supabase } from '../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter both email and password.');
            return;
        }
        try {
            const response = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, display_name: name },
                },
            });
            const { error, data } = response;
            if (error) {
                Alert.alert('Sign Up Error', error.message);
            } else {

                // Store user id in AsyncStorage
                if (data && data.user && data.user.id) {
                    await AsyncStorage.setItem('user_id', data.user.id);
                }
                Alert.alert('Success', 'Check your mail and verify your mail ID');
                navigation.navigate('Main');
            }
        } catch (err) {
            Alert.alert('Sign Up Error', err.message);
        }
    };
    // Utility function to remove user id from AsyncStorage (for logout)
    const logoutAndRemoveId = async (navigation) => {
        await AsyncStorage.removeItem('user_id');
        navigation.replace('Login');
    };

    const handleGoogleSignUp = async () => {
        try {
            const redirectTo = Linking.createURL('/');
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                },
            });
            if (error) {
                Alert.alert('Google Sign Up Error', error.message);
            } else if (data?.url) {
                await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
            }
        } catch (err) {
            Alert.alert('Google Sign Up Error', err.message);
        }
    };

    return (
        <View style={styles.outerContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.logoCircle}>
                                <Image source={require("../assets/logo.png")} />
                            </View>
                            <Text style={styles.headerTitle}>Anicca Labs</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.title}>Sign Up</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                placeholderTextColor="#6ee7b7"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#6ee7b7"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Password"
                                    placeholderTextColor="#6ee7b7"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                >
                                    <Entypo name={showPassword ? "eye" : "eye-with-line"} size={22} color="#6ee7b7" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} activeOpacity={0.85}>
                                <Text style={styles.signUpButtonText}>Sign Up</Text>
                            </TouchableOpacity>
                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>or</Text>
                                <View style={styles.divider} />
                            </View>
                            <TouchableOpacity style={styles.googleSignUpButton} onPress={handleGoogleSignUp} activeOpacity={0.85}>
                                <Entypo name="google-" size={24} color="#00FF84" />
                                <Text style={styles.googleSignUpText}>Sign up with Google</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#181A1B',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 20,
    },
    logoCircle: {
        backgroundColor: '#23272A',
        borderRadius: 4,
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#00FF84',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    headerTitle: {
        color: '#00FF84',
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#23272A',
        borderRadius: 18,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00FF84',
        marginBottom: 18,
        letterSpacing: 1,
    },
    input: {
        width: '100%',
        height: 44,
        borderColor: '#00FF84',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 14,
        color: '#fff',
        backgroundColor: '#181A1B',
        fontSize: 16,
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#00FF84',
        borderWidth: 1.5,
        borderRadius: 8,
        backgroundColor: '#181A1B',
        marginBottom: 14,
    },
    passwordInput: {
        flex: 1,
        height: 44,
        color: '#fff',
        fontSize: 16,
        paddingHorizontal: 12,
    },
    eyeIcon: {
        paddingHorizontal: 12,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpButton: {
        width: '100%',
        backgroundColor: '#00FF84',
        paddingVertical: 13,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#00FF84',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    signUpButtonText: {
        color: '#181A1B',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
    dividerText: {
        color: '#6ee7b7',
        marginHorizontal: 8,
        fontSize: 14,
    },
    googleSignUpButton: {
        width: '100%',
        backgroundColor: '#181A1B',
        borderColor: '#00FF84',
        borderWidth: 1.5,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    googleSignUpText: {
        color: '#00FF84',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    footerText: {
        color: '#6ee7b7',
        fontSize: 15,
    },
    loginText: {
        color: '#00FF84',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 6,
        textDecorationLine: 'underline',
    },
});

export default SignUp;
