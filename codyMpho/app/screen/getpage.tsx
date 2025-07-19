import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

// Get device dimensions for responsive styling
const { width } = Dimensions.get('window');

/**
 * GetStarted Component
 *
 * This component serves as the introductory screen for the application,
 * featuring animated elements and a call to action to begin learning.
 * The UI is designed for a modern, "cool," and professional aesthetic.
 */
export default function GetStarted() {
    // Animation values initialized using useRef for persistent references
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const slideAnimation = useRef(new Animated.Value(60)).current; // Start slightly closer for a quicker slide
    const scaleAnimation = useRef(new Animated.Value(0.9)).current;
    const glowAnimation = useRef(new Animated.Value(0)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current; // For background rotation

    /**
     * useEffect Hook for Initial Animations
     *
     * Triggers a series of parallel animations on component mount,
     * including fade-in, slide-up, scale, looping glow, and subtle background rotation.
     */
    useEffect(() => {
        // Main entrance animations (fade, slide, scale)
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 900, // Slightly faster fade
                easing: Easing.ease, // Smoother ease for opacity
                useNativeDriver: true,
            }),
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 700, // Faster slide
                easing: Easing.out(Easing.back(1.1)), // A slight overshoot for a dynamic feel
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnimation, {
                toValue: 1,
                friction: 5, // Slightly less friction for a snappier spring
                tension: 60, // Increase tension for more pop
                useNativeDriver: true,
            }),
        ]).start();

        // Looping glow animation for the button
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnimation, {
                    toValue: 1,
                    duration: 1200, // Slightly faster glow cycle
                    easing: Easing.easeInOut,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnimation, {
                    toValue: 0,
                    duration: 1200,
                    easing: Easing.easeInOut,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Continuous subtle background rotation
        Animated.loop(
            Animated.timing(rotateAnimation, {
                toValue: 1,
                duration: 30000, // Slower rotation for subtlety
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    /**
     * Handles the press event on the "Get Started" button.
     *
     * Triggers a subtle press animation (scale down and spring back)
     * before navigating to the home screen.
     */
    const handleGetStartedPress = () => {
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 0.96, // Slightly less scale down
                duration: 80, // Quicker press feedback
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnimation, {
                toValue: 1,
                friction: 3.5, // Refined spring for quick rebound
                tension: 50,
                useNativeDriver: true,
            }),
        ]).start(() => router.push('/Home/user_home')); // Navigate after animation completes
    };

    // Interpolate glow animation value to rgba color for dynamic glow effect
    const glowColorInterpolation = glowAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(130, 80, 255, 0.4)', 'rgba(130, 80, 255, 0.8)'], // Richer purple glow
    });

    // Interpolate rotation for background circles
    const rotateInterpolation = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Background decorative circles with subtle rotation */}
            <Animated.View
                style={[
                    styles.backgroundCirclePrimary,
                    { transform: [{ rotate: rotateInterpolation }] }
                ]}
            />
            <Animated.View
                style={[
                    styles.backgroundCircleSecondary,
                    { transform: [{ rotate: rotateInterpolation }] }
                ]}
            />

            {/* Main content section with animations */}
            <Animated.View style={[
                styles.contentContainer,
                { opacity: fadeAnimation, transform: [{ translateY: slideAnimation }] }
            ]}>
                <Text style={styles.title}>
                    Welcome to <Text style={styles.titleHighlight}>CodyMophy</Text>
                </Text>
                <Text style={styles.subtitle}>Learn Coding for free, anytime, anywhere.</Text>
            </Animated.View>

            {/* Get Started Button with scale and glow animations */}
            <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                <Animated.View style={[
                    styles.buttonGlow,
                    { opacity: glowAnimation, backgroundColor: glowColorInterpolation }
                ]} />
                <TouchableOpacity
                    onPress={handleGetStartedPress}
                    activeOpacity={1} // Disable default opacity feedback for custom animation
                    style={styles.getStartedButtonWrapper}
                >
                    <View style={styles.getStartedButton}>
                        <Text style={styles.buttonText}>Get Started</Text>
                        <View style={styles.buttonIcon}>
                            <Text style={styles.buttonIconText}>→ </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Footer section for sign-in option */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Already a member? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// StyleSheet for component styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#0A0A0A', // Deep dark background
        overflow: 'hidden', // Ensures background circles don't spill
    },
    // --- Background Elements ---
    backgroundCirclePrimary: {
        position: 'absolute',
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75,
        backgroundColor: 'rgba(110, 69, 226, 0.07)', // Slightly more saturated for depth
        top: -width * 0.5,
        left: -width * 0.25,
        // Add subtle shadow for atmospheric depth
        shadowColor: '#6E45E2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 50,
        elevation: 1,
    },
    backgroundCircleSecondary: {
        position: 'absolute',
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width * 0.6,
        backgroundColor: 'rgba(110, 69, 226, 0.05)', // Slightly less opaque
        bottom: -width * 0.3,
        right: -width * 0.3,
        shadowColor: '#6E45E2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 40,
        elevation: 1,
    },
    // --- Content Section ---
    contentContainer: {
        alignItems: 'center',
        marginBottom: 60, // More space from the button
        zIndex: 2, // Ensure content is above background circles
    },
    title: {
        fontSize: 42, // Larger font size for impact
        fontWeight: '900', // Extra bold for strong presence
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -1.2, // Tighter spacing for a modern look
        lineHeight: 48, // Control line height for multi-line titles
        // Add subtle text shadow for depth
        textShadowColor: 'rgba(255, 255, 255, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    titleHighlight: {
        color: '#8250FF', // Brighter, more vibrant purple highlight
    },
    subtitle: {
        fontSize: 18,
        color: '#B0B0B0', // Slightly lighter grey for better contrast
        textAlign: 'center',
        maxWidth: width * 0.85, // Wider subtitle for more text
        lineHeight: 26, // More generous line height for readability
        fontWeight: '500',
    },
    // --- Get Started Button ---
    getStartedButtonWrapper: {
        width: width * 0.85, // Slightly wider button
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35, // Match button's border radius
    },
    buttonGlow: {
        position: 'absolute',
        width: width * 0.85 + 40, // More pronounced glow size
        height: 70 + 20, // Taller glow
        borderRadius: 45, // Rounded corners for glow
        alignSelf: 'center',
        // Note: backgroundColor and opacity are animated inline
        filter: 'blur(20px)', // Apply a CSS-like blur (conceptually for RN)
        // In React Native, blur is usually achieved via shadow properties or separate view with opacity
        // Actual RN blur would require <BlurView> or more complex shadow manipulation.
        // We'll rely on the larger size and opacity for the "glow"
    },
    getStartedButton: {
        width: '100%',
        paddingVertical: 20, // More vertical padding
        borderRadius: 35, // More rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#6E45E2', // Primary button color
        zIndex: 1, // Ensure button is above its glow
        // Stronger shadow for prominent button
        shadowColor: '#6E45E2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 15, // For Android shadow
        // Optional: subtle inner border/gradient for depth
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)', // Subtle light border
    },
    buttonText: {
        color: 'white',
        fontSize: 22, // Larger button text
        fontWeight: '700', // Bolder button text
        marginRight: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.2)', // Subtle dark text shadow
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    buttonIcon: {
        backgroundColor: 'rgba(255,255,255,0.25)', // Slightly more opaque icon background
        width: 36, // Larger icon background
        height: 36,
        borderRadius: 18, // Half of width/height for perfect circle
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonIconText: {
        color: 'white',
        fontSize: 22, // Larger arrow icon
        fontWeight: 'bold',
        lineHeight: 22, // Adjust line height to center arrow vertically
    },
    // --- Footer Section ---
    footer: {
        position: 'absolute',
        bottom: 50, // Slightly higher from the bottom
        flexDirection: 'row',
        zIndex: 2,
    },
    footerText: {
        color: '#C0C0C0', // Slightly lighter grey for footer text
        fontSize: 16,
    },
    footerLink: {
        color: '#8250FF', // Use the brighter highlight color for links
        fontWeight: '700', // Bolder link for prominence
    },
});