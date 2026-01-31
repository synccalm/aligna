import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions, Easing } from 'react-native';
import { Icon } from '../../../../../Navigator/router';
import { COLORS } from '../../../../../Theme';
import { scaleWidth } from '../../../../../Helper/responsive';

const { width, height } = Dimensions.get('window');

const FallingIcon = ({ delay, duration, startX, size, color }: { delay: number; duration: number; startX: number; size: number, color: string }) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const opacity = useRef(new Animated.Value(0)).current; // Start invisible

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: 450, // Fall slightly past the container height (400)
                        duration: duration,
                        delay: delay,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 0.5, // Fade in to 50% opacity (subtle)
                            duration: duration * 0.2,
                            delay: delay,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0, // Fade out
                            duration: duration * 0.8,
                            useNativeDriver: true,
                        })
                    ])
                ]),
                Animated.timing(translateY, {
                    toValue: -50,
                    duration: 0,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={{
            position: 'absolute',
            top: 0,
            left: startX,
            transform: [{ translateY }],
            opacity,
            zIndex: 0
        }}>
            <Icon name="raindrop1" size={size} color={color} />
        </Animated.View>
    );
};

export default function FallingAlignaIcons() {
    // Generate random drops with Teal/White colors and smaller size
    const drops = Array.from({ length: 5 }).map((_, i) => ({
        startX: Math.random() * width,
        delay: Math.random() * 4000,
        duration: 5000 + Math.random() * 3000, // Very Slow fall
        size: scaleWidth(8 + Math.random() * 6), // Small size (8-14)
        color: i % 2 === 0 ? COLORS.TEAL : 'white' // Alternate colors
    }));

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents='none'>
            {drops.map((drop, i) => <FallingIcon key={i} {...drop} />)}
        </View>
    );
}
