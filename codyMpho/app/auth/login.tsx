import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'http://10.0.2.2:8000/auth/api';

export default function LoginScreen() {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        email: '',
        username: '',
        password: '',
        password2: '',
    });

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;
    const buttonGlowAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const inputBorderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entry animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 20000,
                    useNativeDriver: true,
                })
            ).start(),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(buttonGlowAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(buttonGlowAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        ]).start();

        // Check for existing token
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) router.replace('/Home/user_home');
        };
        checkAuth();
    }, []);

    const handleSubmit = async () => {
        // Validation
        if (isLogin) {
            if (!formData.emailOrUsername || !formData.password) {
                Alert.alert('Error', 'Please fill in all required fields');
                return;
            }
        } else {
            if (!formData.email || !formData.username || !formData.password || !formData.password2) {
                Alert.alert('Error', 'Please fill in all registration fields');
                return;
            }
            if (formData.password !== formData.password2) {
                Alert.alert('Error', 'Passwords do not match');
                return;
            }
        }

        setLoading(true);

        try {
            // Button press animation
            await new Promise(resolve => {
                Animated.sequence([
                    Animated.timing(buttonScaleAnim, {
                        toValue: 0.95,
                        duration: 80,
                        useNativeDriver: true,
                    }),
                    Animated.spring(buttonScaleAnim, {
                        toValue: 1,
                        friction: 3.5,
                        tension: 50,
                        useNativeDriver: true,
                    }),
                ]).start(resolve);
            });

            let response;
            if (isLogin) {
                const isEmail = formData.emailOrUsername.includes('@');
                const payload = isEmail 
                    ? { email: formData.emailOrUsername, password: formData.password }
                    : { username: formData.emailOrUsername, password: formData.password };

                response = await axios.post(`${API_BASE_URL}/login/`, payload);
            } else {
                response = await axios.post(`${API_BASE_URL}/register/`, {
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    password2: formData.password2,
                });
            }

            if (response.data.token) {
                await SecureStore.setItemAsync('authToken', response.data.token);
            }

            Alert.alert('Success', isLogin ? 'Login successful!' : 'Registration successful!');
            router.replace('/home');
        } catch (error: any) {
            let errorMessage = error.response?.data?.message || 
                             error.response?.data?.detail || 
                             'An error occurred. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const rotateInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const glowColor = buttonGlowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(110, 69, 226, 0.3)', 'rgba(110, 69, 226, 0.7)']
    });

    const borderColor = inputBorderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#333', '#6E45E2']
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Animated Background Elements */}
            <Animated.View style={[
                styles.backgroundCircle1,
                { transform: [{ rotate: rotateInterpolation }] }
            ]} />
            <Animated.View style={[
                styles.backgroundCircle2,
                { transform: [{ rotate: rotateInterpolation }] }
            ]} />

            <Animated.View style={[
                styles.formContainer,
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}>
                <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                <Text style={styles.subtitle}>
                    {isLogin ? 'Sign in to continue your journey' : 'Join our community today'}
                </Text>

                {isLogin ? (
                    <Animated.View style={[styles.inputContainer, { borderColor }]}>
                        <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email or Username"
                            placeholderTextColor="#777"
                            value={formData.emailOrUsername}
                            onChangeText={(text) => setFormData({...formData, emailOrUsername: text})}
                            onFocus={() => Animated.timing(inputBorderAnim, { toValue: 1, duration: 200 }).start()}
                            onBlur={() => Animated.timing(inputBorderAnim, { toValue: 0, duration: 200 }).start()}
                        />
                    </Animated.View>
                ) : (
                    <>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#777"
                                value={formData.email}
                                onChangeText={(text) => setFormData({...formData, email: text})}
                                keyboardType="email-address"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#777"
                                value={formData.username}
                                onChangeText={(text) => setFormData({...formData, username: text})}
                            />
                        </View>
                    </>
                )}

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#777"
                        value={formData.password}
                        onChangeText={(text) => setFormData({...formData, password: text})}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.passwordToggle}
                    >
                        <Ionicons 
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                            size={20} 
                            color="#777" 
                        />
                    </TouchableOpacity>
                </View>

                {!isLogin && (
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#777"
                            value={formData.password2}
                            onChangeText={(text) => setFormData({...formData, password2: text})}
                            secureTextEntry={!showPassword2}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword2(!showPassword2)}
                            style={styles.passwordToggle}
                        >
                            <Ionicons 
                                name={showPassword2 ? 'eye-off-outline' : 'eye-outline'} 
                                size={20} 
                                color="#777" 
                            />
                        </TouchableOpacity>
                    </View>
                )}

                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                    <Animated.View style={[
                        styles.buttonGlow,
                        { backgroundColor: glowColor }
                    ]} />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {isLogin ? 'Login' : 'Register'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    style={styles.switchButton}
                    onPress={() => setIsLogin(!isLogin)}
                >
                    <Text style={styles.switchText}>
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </Text>
                </TouchableOpacity>

                {isLogin && (
                    <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress={() => router.push('/forgot-password')}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
    },
    backgroundCircle1: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75,
        backgroundColor: 'rgba(110, 69, 226, 0.05)',
        top: -width * 0.5,
        left: -width * 0.25,
    },
    backgroundCircle2: {
        position: 'absolute',
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width * 0.6,
        backgroundColor: 'rgba(110, 69, 226, 0.03)',
        bottom: -width * 0.3,
        right: -width * 0.3,
    },
    formContainer: {
        width: '90%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 20,
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#B0B0B0',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
    },
    passwordToggle: {
        paddingLeft: 10,
    },
    buttonGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 25,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6E45E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#6E45E2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    switchButton: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    switchText: {
        color: '#6E45E2',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPasswordButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#B0B0B0',
        fontSize: 14,
    },
});