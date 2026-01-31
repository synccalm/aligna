/* File : sleep-landing.tsx
 * Description : Sleep landing screen with calming dark UI and moon animation
 * Author : SyncCalm
 * Version : v1.2 (Enhanced)
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';

// New Components
import NightModeOverlay from './Components/NightModeOverlay';
import BreathingExercise from './Components/BreathingExercise';
import GuidedAudioPlayer from './Components/GuidedAudioPlayer';
import SleepReminder from './Components/SleepReminder';

// Twinkling Star Component
const Star = ({ style, delay }: any) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1, // Brighter
                    duration: 500, // Very Fast
                    delay: delay,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 500, // Very Fast
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return <Animated.View style={[style, { opacity, backgroundColor: 'white', position: 'absolute', borderRadius: 50 }]} />;
};

export default function SleepLanding(): React.JSX.Element {
    const navigation = useNavigation();

    // Feature States
    const [nightMode, setNightMode] = useState(false);
    const [showBreathing, setShowBreathing] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [showReminder, setShowReminder] = useState(false);

    // Moon Animation
    const moonFloat = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(moonFloat, {
                    toValue: 15, // Larger movement
                    duration: 1500, // Speed up
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(moonFloat, {
                    toValue: 0,
                    duration: 1500, // Speed up
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const toggleNightMode = () => {
        setNightMode(!nightMode);
        Toast.show({
            text1: !nightMode ? 'Night Mode Enabled 🌙' : 'Night Mode Disabled',
            position: 'bottom',
            type: 'info'
        });
    };

    return (
        <View style={[Styles.flexOne]}>
            <StatusBar barStyle={'light-content'} translucent backgroundColor={'transparent'} />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#0F2027', '#203A43', '#2C5364']}
                style={[StyleSheet.absoluteFill]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Stars - Dense Field */}
            {/* Keeping the star field from previous version */}
            <Star style={{ top: 50, left: 30, width: 3, height: 3 }} delay={0} />
            <Star style={{ top: 80, left: 150, width: 2, height: 2 }} delay={200} />
            <Star style={{ top: 120, right: 40, width: 3, height: 3 }} delay={400} />
            <Star style={{ top: 200, left: 20, width: 2, height: 2 }} delay={600} />
            <Star style={{ top: 250, right: 80, width: 3, height: 3 }} delay={100} />
            <Star style={{ top: 300, left: 100, width: 2, height: 2 }} delay={800} />
            <Star style={{ top: 60, right: 120, width: 2, height: 2 }} delay={300} />
            <Star style={{ top: 350, right: 20, width: 3, height: 3 }} delay={500} />
            <Star style={{ top: 180, left: 80, width: 2, height: 2 }} delay={700} />
            <Star style={{ top: 400, left: 50, width: 2, height: 2 }} delay={100} />
            <Star style={{ top: 450, right: 150, width: 3, height: 3 }} delay={900} />
            <Star style={{ top: 100, left: 250, width: 2, height: 2 }} delay={150} />
            <Star style={{ top: 20, right: 20, width: 2, height: 2 }} delay={250} />
            <Star style={{ top: 15, left: 200, width: 2, height: 2 }} delay={50} />
            <Star style={{ top: 220, right: 180, width: 3, height: 3 }} delay={350} />
            <Star style={{ top: 380, left: 280, width: 2, height: 2 }} delay={650} />
            <Star style={{ top: 500, right: 60, width: 3, height: 3 }} delay={150} />
            <Star style={{ top: 70, left: 300, width: 2, height: 2 }} delay={450} />
            <Star style={{ top: 320, right: 260, width: 2, height: 2 }} delay={750} />

            <SafeAreaView style={[Styles.flexOne]}>
                {/* Header */}
                <View style={[Styles.row, Styles.spaceBetween, Styles.padding16, Styles.alignItemsCenter]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[Styles.padding8]}>
                        <Icon name="arrow" size={scaleWidth(24)} color={COLORS.WHITE_SMOKE} style={{ transform: [{ rotate: '90deg' }], opacity: 0.8 }} />
                    </TouchableOpacity>

                    <View style={Styles.row}>
                        <TouchableOpacity onPress={toggleNightMode} style={[Styles.padding8, { marginRight: 8 }]}>
                            <Icon name={nightMode ? "eye-closed" : "eye"} size={scaleWidth(22)} color={COLORS.WHITE_SMOKE} style={{ opacity: 0.8 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowReminder(true)} style={[Styles.padding8]}>
                            <Icon name="bell" size={scaleWidth(20)} color={COLORS.WHITE_SMOKE} style={{ opacity: 0.8 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero Content */}
                <View style={[Styles.flexOne, Styles.center]}>
                    <Animated.View style={{ transform: [{ translateY: moonFloat }] }}>
                        <Icon name="moon" size={scaleWidth(120)} color="#FDFBD3" style={{ textShadowColor: 'rgba(253, 251, 211, 0.5)', textShadowRadius: 20 }} />
                    </Animated.View>

                    <View style={[Styles.marginTop40, Styles.alignItemsCenter]}>
                        <Text style={[Styles.RubicBold, Styles.fontSize32, { color: '#FDFBD3', opacity: 0.9, letterSpacing: 1 }]}>
                            Good Night
                        </Text>
                        <Text style={[Styles.rubicRegualr, Styles.fontSize16, { color: COLORS.WHITE_SMOKE, opacity: 0.6, marginTop: 8 }]}>
                            Let your mind rest
                        </Text>
                    </View>

                    {/* Tools Section */}
                    <View style={[Styles.row, Styles.marginTop40]}>
                        <TouchableOpacity
                            onPress={() => setShowBreathing(true)}
                            style={[styles.toolBtn]}
                        >
                            <Icon name="wind" size={24} color="#DDD" />
                            <Text style={styles.toolText}>Breathe</Text>
                        </TouchableOpacity>

                        <View style={{ width: 20 }} />

                        <TouchableOpacity
                            onPress={() => setShowAudio(true)}
                            style={[styles.toolBtn]}
                        >
                            <Icon name="music" size={24} color="#DDD" />
                            <Text style={styles.toolText}>Listen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Overlays / Modals */}
            <NightModeOverlay visible={nightMode} />

            {showBreathing && (
                <View style={StyleSheet.absoluteFill}>
                    <BreathingExercise onClose={() => setShowBreathing(false)} />
                </View>
            )}

            {showAudio && (
                <View style={StyleSheet.absoluteFill}>
                    <GuidedAudioPlayer onClose={() => setShowAudio(false)} />
                </View>
            )}

            {showReminder && (
                <View style={StyleSheet.absoluteFill}>
                    <SleepReminder onClose={() => setShowReminder(false)} />
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    toolBtn: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        width: 100
    },
    toolText: {
        color: '#DDD',
        marginTop: 8,
        fontSize: 12,
        fontWeight: '500'
    }
});
