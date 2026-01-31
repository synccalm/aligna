/* File : grow.tsx
 * Description : Premium Growth & Wishlist Module
 * Version : v2.0
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
    Animated,
    Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Styles, COLORS } from '../../../Theme';
import { myEdges } from '../../../Helper/type-models';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
// import { StorageHelper, WishlistItem } from '../../../Helper/storage';

const { width } = Dimensions.get('window');

// --- Inspiration Data ---
const INSPIRATION_CATEGORIES = [
    {
        id: 'habit',
        title: 'Daily Rituals',
        subtitle: 'Structure & Discipline',
        icon: 'moon',
        palette: ['#00897B', '#4DB6AC', '#B2DFDB'], // Teal -> Mint -> Soft Green
        color: 'transparent',
        accent: '#D3D3D3',
        items: [
            { title: 'Morning Routine', description: 'Start with intention.' },
            { title: 'Early Rise', description: '6 AM consistency.' },
            { title: 'Gratitude', description: '3 things daily.' },
        ]
    },
    {
        id: 'wellness',
        title: 'Mind & Body',
        subtitle: 'Holistic Well-being',
        icon: 'heart',
        palette: ['#5E35B1', '#9575CD', '#D1C4E9'], // Indigo -> Lavender -> Blush
        color: 'transparent',
        accent: '#B0BEC5',
        items: [
            { title: 'Movement', description: '30 mins active.' },
            { title: 'Stillness', description: '15 mins meditation.' },
            { title: 'Nourish', description: 'Whole foods only.' },
        ]
    },
    {
        id: 'style',
        title: 'Future Self',
        subtitle: 'Aspirations & Lifestyle',
        icon: 'star',
        palette: ['#D4AF37', '#E6C15C', '#F9E79F'], // Gold -> Champagne -> Pale
        color: 'transparent',
        accent: '#D7CCC8',
        items: [
            { title: 'Timepiece', description: 'Save for quality.' },
            { title: 'Wardrobe', description: 'Invest in basics.' },
            { title: 'Workspace', description: 'Create your sanctuary.' },
        ]
    }
];

// --- Animated Icon Stack Component (Redesigned) ---
const AnimatedIconStack = ({
    icon,
    palette,
    delay = 0
}: {
    icon: string,
    palette: string[],
    delay?: number
}) => {
    // Animation Values
    const floatAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // 1. Float Animation (Vertical)
        const float = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -12, // More visible float
                    duration: 4000,
                    delay: delay,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                })
            ])
        );

        // 2. Scale Breathing (Subtle)
        const scale = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.12,
                    duration: 5000, // Slower breathing
                    delay: delay + 500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                })
            ])
        );

        // 3. Rotation (Very gentle)
        const rotate = Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1, // 1 = 6 degrees
                    duration: 6000,
                    delay: delay + 200,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                }),
                Animated.timing(rotateAnim, {
                    toValue: -1, // -1 = -6 degrees
                    duration: 6000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 6000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease)
                })
            ])
        );

        Animated.parallel([float, scale, rotate]).start();
    }, []);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-6deg', '6deg']
    });

    return (
        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
            {/* Back Layer (Smallest, Faded) */}
            <Animated.View style={{
                position: 'absolute',
                opacity: 0.3,
                transform: [
                    { translateY: Animated.multiply(floatAnim, 0.4) }, // Moves less
                    { scale: 0.7 },
                    { rotate: rotateInterpolate } // Rotates with main
                ]
            }}>
                <Icon name={icon} size={40} color={palette[2]} />
            </Animated.View>

            {/* Middle Layer (Medium, Semi-Faded) */}
            <Animated.View style={{
                position: 'absolute',
                opacity: 0.6,
                transform: [
                    { translateY: Animated.multiply(floatAnim, 0.7) }, // Moves medium
                    { scale: 0.85 },
                    { rotate: '15deg' } // Static offset rotation
                ]
            }}>
                <Icon name={icon} size={40} color={palette[1]} />
            </Animated.View>

            {/* Front Layer (Main, Vibrant) */}
            <Animated.View style={{
                transform: [
                    { translateY: floatAnim },
                    { scale: scaleAnim }, // Breaths
                    { rotate: rotateInterpolate }
                ],
                shadowColor: palette[0],
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12
            }}>
                <Icon name={icon} size={44} color={palette[0]} />
            </Animated.View>
        </View>
    );
};

export default function Grow(): React.JSX.Element {
    const navigation = useNavigation();

    const handleCreateFromTemplate = (template: { title: string; description: string }) => {
        navigation.navigate('create-wishlist' as never, { prefill: template } as never);
    };

    return (
        <View style={Styles.flexOne}>
            {/* Ambient Background Gradient - Ultra Subtle */}
            <LinearGradient
                colors={['#FFFEFC', '#FDFCF8', '#F4F7F6']} // Warmer off-white to very pale sage/grey
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={[Styles.flexOne]} edges={myEdges}>
                <StatusBar barStyle={'dark-content'} backgroundColor="transparent" translucent={true} />

                <ScrollView
                    style={[Styles.flexGrowOne]}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                >

                    {/* Magazine Header */}
                    <View style={[Styles.paddingHorizontal24, Styles.marginTop24, Styles.marginBottom32]}>
                        <Text style={[Styles.rubicRegualr, { fontSize: 13, color: '#A0A0A0', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }]}>
                            Manifestation
                        </Text>
                        <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 36, color: '#2C2C2C', lineHeight: 44 }}>
                            What are you{'\n'}growing into?
                        </Text>
                    </View>

                    {/* Personal Wishlist Feature Card */}
                    <View style={[Styles.paddingHorizontal24, Styles.marginBottom40]}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('wishlist' as never)}
                            style={localStyles.wishlistCard}
                        >
                            <View>
                                <Text style={[Styles.rubicMedium, { fontSize: 18, color: '#333', marginBottom: 6 }]}>
                                    Your Wishlist
                                </Text>
                                <Text style={[Styles.rubicRegualr, { fontSize: 14, color: '#777' }]}>
                                    3 Active Intentions
                                </Text>
                            </View>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F0', justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="arrow-right" size={18} color="#555" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#EFEFEF', marginHorizontal: 24, marginBottom: 32 }} />

                    <View style={[Styles.paddingHorizontal24, Styles.marginBottom16]}>
                        <Text style={[Styles.rubicMedium, { fontSize: 14, color: '#333' }]}>
                            Explore Paths
                        </Text>
                    </View>

                    {/* Editorial Category List */}
                    <View style={{ paddingHorizontal: 24 }}>
                        {INSPIRATION_CATEGORIES.map((cat, index) => (
                            <View key={cat.id} style={{ marginBottom: 40 }}>
                                {/* Category Header */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <AnimatedIconStack
                                        icon={cat.icon}
                                        palette={cat.palette}
                                        delay={index * 200}
                                    />
                                    <View style={{ marginLeft: 6 }}>
                                        <Text style={{ fontFamily: 'Rubik-Medium', fontSize: 20, color: '#333' }}>{cat.title}</Text>
                                        <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 14, color: '#888', marginTop: 2 }}>{cat.subtitle}</Text>
                                    </View>
                                </View>

                                {/* Items List */}
                                <View>
                                    {cat.items.map((item, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            activeOpacity={0.7}
                                            onPress={() => handleCreateFromTemplate(item)}
                                            style={localStyles.itemRow}
                                        >
                                            <View>
                                                <Text style={[Styles.rubicRegualr, { fontSize: 16, color: '#444' }]}>{item.title}</Text>
                                                <Text style={[Styles.rubicRegualr, { fontSize: 12, color: '#999', marginTop: 2 }]}>{item.description}</Text>
                                            </View>
                                            <View style={{ opacity: 0.3 }}>
                                                <Icon name="add-circle" size={16} color="#333" />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const localStyles = StyleSheet.create({
    wishlistCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.03, // Very subtle shadow
        shadowRadius: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#FAFAFA' // Almost invisible border
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5' // Very light divider
    }
});
