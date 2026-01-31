import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../../../Navigator/router';
import { Styles, COLORS } from '../../../Theme';
import { scaleWidth } from '../../../Helper/responsive';

const { width } = Dimensions.get('window');

export default function Visualization(): React.JSX.Element {
    const navigation = useNavigation();

    // Animation Values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start Fade In
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        // Orb Breathing Animation (Scale)
        const breathe = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        // Orb Floating Animation (TranslateY)
        const float = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -20,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        );

        // Start Ambient Loops
        Animated.parallel([breathe, float]).start();

        return () => {
            // Cleanup handled by unmount usually
        };
    }, []);

    return (
        <View style={Styles.flexOne}>
            <LinearGradient
                colors={['#1A1A2E', '#16213E', '#2A2D43']} // Deep Calm Colors (Indigo/Navy)
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header */}
            <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.spaceBetween, { marginTop: scaleWidth(40), zIndex: 10 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}
                >
                    <Icon name="arrow-left" size={scaleWidth(24)} color={COLORS.WHITE_SMOKE} />
                </TouchableOpacity>
                <View style={{ width: scaleWidth(40) }} />
            </View>

            {/* Content */}
            <View style={[Styles.flexOne, Styles.center, { paddingBottom: scaleWidth(100) }]}>

                {/* Glowing Orb */}
                <Animated.View
                    style={[
                        localStyles.orbContainer,
                        {
                            transform: [
                                { scale: scaleAnim },
                                { translateY: floatAnim }
                            ],
                            opacity: fadeAnim
                        }
                    ]}
                >
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0.8)', 'rgba(168, 218, 220, 0.4)', 'transparent']}
                        style={localStyles.orb}
                    />
                </Animated.View>

                {/* Text Guide */}
                <Animated.View style={{ marginTop: scaleWidth(60), opacity: fadeAnim, alignItems: 'center', paddingHorizontal: 32 }}>
                    <Text style={[Styles.rubicMedium, { fontSize: 22, color: '#Eaeaea', textAlign: 'center', lineHeight: 34, letterSpacing: 0.5 }]}>
                        Close your eyes and see it as real.
                    </Text>
                    <Text style={[Styles.rubicRegualr, { fontSize: 14, color: '#B0B0C0', textAlign: 'center', marginTop: 16, opacity: 0.8 }]}>
                        Feel the emotion of your wish fulfilled.
                    </Text>
                </Animated.View>

            </View>

        </View>
    );
}

const localStyles = StyleSheet.create({
    orbContainer: {
        width: width * 0.5,
        height: width * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#A8DADC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 20,
    },
    orb: {
        width: '100%',
        height: '100%',
        borderRadius: 1000,
    }
});
