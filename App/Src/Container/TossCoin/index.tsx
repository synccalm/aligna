import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import LinearGradient from 'react-native-linear-gradient';

export default function TossCoin(): React.JSX.Element {
    const navigation = useNavigation();
    const [isTossing, setIsTossing] = useState(false);
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);

    // Animation values
    const rotateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    // Constants
    const TOSS_DURATION = 10000; // 10 seconds

    const startToss = () => {
        if (isTossing) return;

        setIsTossing(true);
        setResult(null);
        textOpacity.setValue(0);

        // Determine result beforehand but don't show it
        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';

        // 1. Continuous Spin Animation
        // We want it to spin fast for most of the time, then slow down

        // Total rotations: Let's say 20 full rotations (7200 degrees) + extra for result
        // Heads = 0 degrees (modulo 360)
        // Tails = 180 degrees (modulo 360)

        const baseRotations = 30 * 360;
        const finalOffset = outcome === 'heads' ? 0 : 180;
        const finalValue = baseRotations + finalOffset;

        Animated.parallel([
            // Rotation
            Animated.timing(rotateY, {
                toValue: finalValue,
                duration: TOSS_DURATION,
                // Custom easing: linear start, slow ease out at the very end
                easing: Easing.bezier(0.25, 1, 0.5, 1),
                useNativeDriver: true,
            }),
            // Subtle Scale Pulse
            Animated.sequence([
                Animated.timing(scale, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 0.9, duration: 1000, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 0.9, duration: 1000, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 1, duration: TOSS_DURATION - 5000, useNativeDriver: true }),
            ])
        ]).start(({ finished }) => {
            if (finished) {
                setResult(outcome);
                setIsTossing(false);

                // Show result text
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                }).start();

                // Reset rotation value to equivalent minimal angle to prevent overflow if tossed again
                rotateY.setValue(finalOffset);
            }
        });

    };

    useEffect(() => {
        // Auto start on mount
        startToss();
        return () => {
            rotateY.stopAnimation();
        };
    }, []);

    const handleTossAgain = () => {
        startToss();
    };

    // Interpolate rotation for front and back visibility
    const frontOpacity = rotateY.interpolate({
        inputRange: [0, 90, 180, 270, 360],
        outputRange: [1, 0, 0, 0, 1],
        extrapolate: 'clamp' // Actually we need modulo behavior...
    });

    // Given React Native's opacity interpolation limitations with loops, 
    // we render two views (front/back) and use backfaceVisibility: 'hidden'
    // But on Android backfaceVisibility can be tricky. 
    // Let's use simple rotation + Z index or just backfaceVisibility 'hidden' if platform supports it smoothly.
    // Or simply rely on the image textures revolving.

    // Interpolation for string rotation
    const rotateStr = rotateY.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
    });

    // Since we want specific images for Heads/Tail, we can put them back-to-back in 3D

    return (
        <View style={[Styles.flexOne, { backgroundColor: '#FBFCFC' }]}>
            {/* Background - Soft Gradient */}
            <LinearGradient
                colors={['#FBFCFC', '#F0F4F4', '#E6EEF0']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header */}
            <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.spaceBetween, { marginTop: scaleWidth(40) }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ padding: 8 }}
                >
                    <Icon name="arrow-left" size={scaleWidth(24)} color={COLORS.CHARCOL} />
                </TouchableOpacity>
                <Text style={[Styles.rubicMedium, Styles.fontSize20, { color: COLORS.CHARCOL }]}>Head & Tail</Text>
                <View style={{ width: scaleWidth(40) }} />
            </View>

            <View style={[Styles.flexOne, Styles.center]}>

                {/* The Coin Container */}
                <View style={{ height: scaleWidth(220), width: scaleWidth(220), justifyContent: 'center', alignItems: 'center' }}>

                    {/* HEADS (Front) */}
                    <Animated.View style={{
                        position: 'absolute',
                        width: scaleWidth(200),
                        height: scaleWidth(200),
                        backfaceVisibility: 'hidden',
                        transform: [{ rotateY: rotateStr }, { scale }]
                    }}>
                        <View style={localStyles.coinCircle}>
                            {/* Outer Ring */}
                            <View style={[localStyles.coinInner, { borderColor: COLORS.TANGERING }]}>
                                {/* Heads Icon = Star */}
                                <Image
                                    source={require('../../../Assets/img/doodle_icon_star.png')}
                                    resizeMode="contain"
                                    style={{ width: scaleWidth(100), height: scaleWidth(100) }}
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* TAILS (Back) */}
                    <Animated.View style={{
                        position: 'absolute',
                        width: scaleWidth(200),
                        height: scaleWidth(200),
                        backfaceVisibility: 'hidden',
                        transform: [{ rotateY: rotateStr }, { rotateY: '180deg' }, { scale }]
                    }}>
                        <View style={localStyles.coinCircle}>
                            {/* Outer Ring */}
                            <View style={[localStyles.coinInner, { borderColor: COLORS.TEAL }]}>
                                {/* Tails Icon = Moon */}
                                <Image
                                    source={require('../../../Assets/img/doodle_icon_moon.png')}
                                    resizeMode="contain"
                                    style={{ width: scaleWidth(100), height: scaleWidth(100) }}
                                />
                            </View>
                        </View>
                    </Animated.View>

                </View>

                <View style={{ height: scaleWidth(100), justifyContent: 'center', alignItems: 'center', marginTop: scaleWidth(40) }}>
                    {isTossing ? (
                        <Text style={[Styles.rubicRegualr, Styles.fontSize16, { color: COLORS.SLATE, letterSpacing: 1 }]}>
                            Let the universe decide...
                        </Text>
                    ) : (
                        result && (
                            <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
                                <Text style={[Styles.rubicMedium, Styles.fontSize36, { color: COLORS.CHARCOL, marginBottom: 8 }]}>
                                    {result === 'heads' ? 'HEADS' : 'TAILS'}
                                </Text>
                                <Text style={[Styles.rubicRegualr, Styles.fontSize14, { color: COLORS.SLATE }]}>
                                    Trust your intuition.
                                </Text>

                                <TouchableOpacity
                                    onPress={handleTossAgain}
                                    style={[Styles.marginTop24, { backgroundColor: COLORS.TEAL, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }]}
                                >
                                    <Text style={[Styles.rubicMedium, Styles.fontSize14, { color: COLORS.WHITE_SMOKE }]}>
                                        Toss Again
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )
                    )}
                </View>

            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    coinCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 1000,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    coinInner: {
        width: '90%',
        height: '90%',
        borderRadius: 1000,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFCFA'
    }
});
