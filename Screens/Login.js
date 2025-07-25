import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../supabase'; // Make sure you have exported your supabase client from this path
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please enter both email and password.');
            return;
        }
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                Alert.alert('Login Error', error.message);
            } else if (data && data.user && data.user.id) {
                await AsyncStorage.setItem('user_id', data.user.id);
                navigation.replace('Main');
            } else {
                Alert.alert('Login Error', 'Unknown error occurred.');
            }
        } catch (err) {
            Alert.alert('Login Error', err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const redirectTo = Linking.createURL('/');
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                },
            });
            if (error) {
                Alert.alert('Google Login Error', error.message);
            } else if (data?.url) {
                await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
            }
        } catch (err) {
            Alert.alert('Google Login Error', err.message);
        }
    };

    return (
        <View style={styles.outerContainer}>
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Image source={require("../assets/logo.png")} />
                </View>
                <Text style={styles.headerTitle}>Anicca Labs</Text>
            </View>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Login</Text>
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
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.divider} />
                    </View>
                    <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn} activeOpacity={0.85}>
                        <Entypo name="google-" size={24} color="#00FF84" />
                        <Text style={styles.googleSignInText}>Sign in with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#181A1B', // Black Reddit-style background
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
    loginButton: {
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
    loginButtonText: {
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
    googleSignInButton: {
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
    googleSignInText: {
        color: '#00FF84',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        letterSpacing: 0.5,
    },
    forgotText: {
        color: '#6ee7b7',
        fontSize: 14,
        marginTop: 8,
        textDecorationLine: 'underline',
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
    signupText: {
        color: '#00FF84',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 6,
        textDecorationLine: 'underline',
    },
});

export default Login;