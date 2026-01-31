/* File : meditation-landing.tsx
 * Description : Soft, calming meditation landing screen with breathing animations
 * Author : SyncCalm
 * Version : v1.0
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';

// Reusing Icon component logic for back button 

const Circle = ({ size, opacity, duration, delay, scaleRange }: any) => {
    const scaleValue = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                    delay: delay
                }),
                Animated.timing(scaleValue, {
                    toValue: 0,
                    duration: duration,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    const scale = scaleValue.interpolate({
        inputRange: [0, 1],
        outputRange: scaleRange // [0.8, 1.2]
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: COLORS.TEAL, // Using TEAL for calm, maybe lighter opacity
                opacity: opacity,
                transform: [{ scale }]
            }}
        />
    );
};

export default function MeditationLanding(): React.JSX.Element {
    const navigation = useNavigation();
    const [soundOn, setSoundOn] = useState<boolean>(true);

    // Fade in text animation
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        // Simulate playing OM sound
        // In real app, we would load sound here.
        return () => {
            // Stop sound
        }
    }, []);

    const toggleSound = () => {
        const newState = !soundOn;
        setSoundOn(newState);
        Toast.show({
            type: 'success',
            text1: newState ? 'OM Sound Playing 🎵' : 'OM Sound Paused',
            position: 'bottom'
        });
        // Logic to toggle sound
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={toggleSound} style={[Styles.flexOne]}>
            <StatusBar barStyle={'dark-content'} translucent backgroundColor={'transparent'} />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#E0F7FA', '#E1BEE7', '#F3E5F5']} // Soft Teal -> Soft Lavender -> Soft Pink
                style={[StyleSheet.absoluteFill]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={[Styles.flexOne]}>
                {/* Header with Back & Sound Toggle */}
                <View style={[Styles.row, Styles.spaceBetween, Styles.padding16, Styles.alignItemsCenter]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[Styles.padding8]}>
                        <Icon name="arrow" size={scaleWidth(24)} color={COLORS.CHARCOL} style={{ transform: [{ rotate: '90deg' }], opacity: 0.6 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleSound} style={[Styles.padding8]}>
                        {/* Using existing icons, fallback if volume icons missing */}
                        <Icon name={soundOn ? "radio-checked" : "radio-unchecked"} size={scaleWidth(20)} color={COLORS.CHARCOL} style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                </View>

                {/* Central Animation */}
                <View style={[Styles.flexOne, Styles.center]}>
                    {/* Layered Breathing Circles - High Speed */}
                    <Circle size={300} opacity={0.1} duration={3000} delay={0} scaleRange={[0.85, 1.15]} />
                    <Circle size={220} opacity={0.15} duration={2500} delay={300} scaleRange={[0.9, 1.1]} />
                    <Circle size={150} opacity={0.2} duration={2000} delay={100} scaleRange={[0.85, 1.15]} />

                    {/* Main Breathing Center */}
                    <Animated.View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: 'white',
                            opacity: 0.8,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                            elevation: 5,
                        }}
                    />
                </View>

                {/* Uplifting Text */}
                <Animated.View style={[{ padding: 32, opacity: fadeAnim, alignItems: 'center' }]}>
                    <Text style={[Styles.RubicBold, Styles.fontSize24, { color: COLORS.CHARCOL, opacity: 0.7, marginBottom: 8 }]}>
                        Welcome
                    </Text>
                    <Text style={[Styles.rubicRegualr, Styles.fontSize16, { color: COLORS.CHARCOL, opacity: 0.5 }]}>
                        Take a deep breath
                    </Text>
                </Animated.View>

                {/* Bottom Spacer */}
                <View style={{ height: 50 }} />
            </SafeAreaView>
        </TouchableOpacity>
    );
}
