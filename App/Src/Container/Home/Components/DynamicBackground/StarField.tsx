import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

// Single Star
const Star = ({ delay, top, left, size }: any) => {
    const opacity = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.8,
                    duration: 1500,
                    delay: delay,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.2,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return <Animated.View style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'white',
        opacity
    }} />;
};

export default function StarField() {
    // Generate random stars
    // Using fixed mock data for stability in this component, or we could generate random positions
    // Keep it static for performance optimization in this snippet
    const stars = [
        { top: 50, left: 30, size: 2, delay: 0 },
        { top: 120, left: 150, size: 3, delay: 500 },
        { top: 80, left: 280, size: 2, delay: 200 },
        { top: 200, left: 60, size: 2, delay: 800 },
        { top: 250, left: 320, size: 3, delay: 100 },
        { top: 40, left: 200, size: 1, delay: 600 },
        { top: 300, left: 120, size: 2, delay: 300 },
        { top: 350, left: 250, size: 2, delay: 900 },
        { top: 150, left: 340, size: 3, delay: 400 },
        { top: 100, left: 90, size: 1, delay: 1000 },
        { top: 220, left: 200, size: 2, delay: 200 },
        { top: 180, left: 10, size: 3, delay: 700 },
    ];

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {stars.map((s, i) => (
                <Star key={i} {...s} />
            ))}
        </View>
    );
}
