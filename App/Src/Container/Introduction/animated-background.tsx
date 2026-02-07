/* File : animated-background.tsx
 * Description : Animated Gradient Background for Introduction Screen
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// Using same theme colors as splash screen
const COLORS = {
    TEAL_DARK: 'rgba(29, 54, 57, 1)',
    TEAL_LIGHT: 'rgba(46, 82, 86, 0.8)',
    ACCENT: 'rgba(238, 242, 245, 0.1)',
};

const AnimatedOrb = ({ startX, startY, size, duration, delay }: { startX: number, startY: number, size: number, duration: number, delay: number }) => {
    const translateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateAnim, {
                    toValue: 1,
                    duration: duration,
                    delay: delay,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(translateAnim, {
                    toValue: 0,
                    duration: duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    const translateY = translateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -50]
    });

    const scale = translateAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1]
    });

    return (
        <Animated.View style={{
            position: 'absolute',
            left: startX,
            top: startY,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: COLORS.ACCENT,
            transform: [{ translateY }, { scale }],
            opacity: 0.3
        }} />
    );
}

const AnimatedBackground = () => {
    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={[COLORS.TEAL_DARK, '#1a2e30']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            {/* Subtle floating orbs */}
            <AnimatedOrb startX={width * 0.1} startY={height * 0.2} size={100} duration={8000} delay={0} />
            <AnimatedOrb startX={width * 0.7} startY={height * 0.5} size={150} duration={12000} delay={500} />
            <AnimatedOrb startX={width * 0.3} startY={height * 0.8} size={80} duration={10000} delay={1000} />

            {/* Overlay Gradient for depth */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
};

export default AnimatedBackground;
