import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions, Easing } from 'react-native';

const { height } = Dimensions.get('window');

// Single Flake
const Flake = ({ delay, left, size, duration }: any) => {
    const translateY = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateY, {
                toValue: height, // Fall to bottom
                duration: duration,
                delay: delay,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    return <Animated.View style={{
        position: 'absolute',
        top: -20, // Start above screen
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(255,255,255,0.6)',
        transform: [{ translateY }]
    }} />;
};

export default function SnowFall() {
    const flakes = [
        { left: 30, size: 4, duration: 8000, delay: 0 },
        { left: 100, size: 3, duration: 12000, delay: 2000 },
        { left: 200, size: 5, duration: 9000, delay: 1000 },
        { left: 300, size: 3, duration: 11000, delay: 500 },
        { left: 150, size: 4, duration: 10000, delay: 3000 },
        { left: 250, size: 2, duration: 13000, delay: 4000 },
        { left: 50, size: 3, duration: 14000, delay: 1500 },
        { left: 200, size: 5, duration: 9000, delay: 1000 },
        { left: 300, size: 3, duration: 11000, delay: 500 },
        { left: 130, size: 4, duration: 10000, delay: 3000 },
        { left: 250, size: 2, duration: 13000, delay: 4000 },
        { left: 140, size: 3, duration: 14000, delay: 1500 },
        { left: 200, size: 5, duration: 9000, delay: 1000 },
        { left: 300, size: 3, duration: 11000, delay: 500 },
        { left: 150, size: 4, duration: 10000, delay: 3000 },
        { left: 200, size: 2, duration: 13000, delay: 4000 },
        { left: 50, size: 3, duration: 14000, delay: 1500 },
        { left: 200, size: 5, duration: 9000, delay: 1000 },
        { left: 20, size: 3, duration: 11000, delay: 500 },
        { left: 150, size: 4, duration: 10000, delay: 3000 },
        { left: 250, size: 2, duration: 13000, delay: 4000 },
        { left: 70, size: 3, duration: 14000, delay: 1500 },
        { left: 200, size: 5, duration: 9000, delay: 1000 },
    ];

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {flakes.map((f, i) => (
                <Flake key={i} {...f} />
            ))}
        </View>
    );
}
