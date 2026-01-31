/* File : wishlist.tsx
 * Description : Wishlist screen - The Vision Board
 * Author : SyncCalm
 * Version : v2.0
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Alert, ActivityIndicator, Image, Animated, StyleSheet, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';

import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { StorageHelper, WishlistItem } from '../../../Helper/storage';
import PushNotification from 'react-native-push-notification';

type RootStackParamList = {
    'create-wishlist': { item?: WishlistItem } | undefined;
};
type NavigationType = StackNavigationProp<RootStackParamList>;

// Vision Board Palette
const PALETTE = {
    BG_CREAM: '#FDFBF7',
    SAGE_LIGHT: '#E0E5DF',
    SAGE_DARK: '#8DA399',
    TEAL_MAIN: '#4DB6AC',
    TEAL_SOFT: '#B2DFDB',
    GOLD_ACCENT: '#FDD835',
    TEXT_MAIN: '#37474F',
    TEXT_LIGHT: '#90A4AE',
    WHITE_ISO: '#FFFFFF'
};

// --- Design System for Wishlist Cards ---
const DASH_PALETTES = [
    ['#00897B', '#4DB6AC', '#B2DFDB'], // Teal
    ['#F57C00', '#FFB74D', '#FFE0B2'], // Tangerine
    ['#5E35B1', '#9575CD', '#D1C4E9'], // Lavender
    ['#1E88E5', '#64B5F6', '#BBDEFB'], // Misty Blue
    ['#8E24AA', '#BA68C8', '#E1BEE7'], // Cosmic Purple
];

const WishCard = ({ item, index, navigation, onDelete, onAlign }: {
    item: WishlistItem,
    index: number,
    navigation: any,
    onDelete: (id: string, title: string) => void,
    onAlign: (item: WishlistItem) => void
}) => {
    // Entrance Animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: index * 100, // Staggered
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay: index * 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true
            })
        ]).start();
    }, []);

    // Select Palette
    const palette = DASH_PALETTES[index % DASH_PALETTES.length];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Animated.View style={[styles.cardContainer]}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('wishlist-details', { item })}
                style={styles.card}>
                {/* Image Background or Gradient */}
                <View style={styles.imageContainer}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                    ) : (
                        <LinearGradient
                            colors={[palette[1], palette[0]]}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                    )}

                    {/* Overlay for text readability if image exists */}
                    {item.image &&
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                            style={StyleSheet.absoluteFill}
                        />
                    }

                    {/* Content Overlay */}
                    <View style={styles.cardContent}>
                        <View>
                            <Text style={[Styles.RubicBold, Styles.fontSize18, { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.2)', textShadowRadius: 4 }]}>
                                {item.title}
                            </Text>
                            {item.description ? (
                                <Text numberOfLines={1} style={[Styles.rubicRegualr, Styles.fontSize12, { color: 'rgba(255,255,255,0.9)', marginTop: 4 }]}>
                                    {item.description}
                                </Text>
                            ) : null}
                        </View>

                        {/* Status Chip */}
                        <View style={[styles.statusChip, { backgroundColor: item.status === 'completed' ? PALETTE.GOLD_ACCENT : 'rgba(255,255,255,0.2)' }]}>
                            <Text style={[Styles.rubicMedium, { fontSize: 10, color: item.status === 'completed' ? '#FFF' : '#FFF' }]}>
                                {item.status === 'completed' ? 'ALIGNED' : 'MOVING TOWARD'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Actions Footer */}
                <View style={styles.cardFooter}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('create-wishlist', { item })}>
                            <Icon name="edit" size={scaleWidth(14)} color={PALETTE.SAGE_DARK} />
                        </TouchableOpacity>
                        <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: PALETTE.TEXT_LIGHT, marginLeft: 6 }]}>
                            {item.deadline ? `By ${formatDate(new Date(item.deadline).toISOString())}` : 'No deadline'}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        {item.status !== 'completed' && (
                            <TouchableOpacity onPress={() => onAlign(item)} style={{ marginRight: 16 }}>
                                <Icon name="check-mark" size={scaleWidth(32)} color={palette[0]} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => onDelete(item.id, item.title)}>
                            <Icon name="delete-basket" size={scaleWidth(25)} color={PALETTE.SAGE_DARK} style={{ opacity: 0.6 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function Wishlist(): React.JSX.Element {
    const navigation = useNavigation<NavigationType>();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'in_progress' | 'completed'>('in_progress');

    useFocusEffect(useCallback(() => { loadWishlist(); }, []));

    const loadWishlist = async () => {
        setIsLoading(true);
        const data = await StorageHelper.getWishlist();
        setWishlist(data.reverse());
        setIsLoading(false);
    };

    const handleDelete = (id: string, title: string) => {
        Alert.alert("Release Wish", `Do you want to release "${title}" from your vision?`, [
            { text: "Keep", style: "cancel" },
            {
                text: "Release", style: "destructive", onPress: async () => {
                    const updated = await StorageHelper.deleteWishlist(id);
                    setWishlist(updated.reverse());
                }
            }
        ]);
    };

    const handleAlign = (item: WishlistItem) => {
        Alert.alert("Fulfill Wish", `Is your vision for "${item.title}" fully aligned now?`, [
            { text: "Not yet", style: "cancel" },
            {
                text: "Yes, Fulfilled", onPress: async () => {
                    const updated = await StorageHelper.updateWishlistStatus(item.id, 'completed');
                    if (item.alarmId) { /* Cancel alarm logic if linked */ }
                    setWishlist(updated.reverse());
                    // Ideally trigger a gentle success animation/feedback here
                }
            }
        ]);
    };

    const filteredWishlist = wishlist.filter(item => item.status === activeTab);

    return (
        <View style={Styles.flexOne}>
            <StatusBar barStyle={'dark-content'} translucent backgroundColor='transparent' />
            {/* Ambient Background */}
            <LinearGradient colors={[PALETTE.BG_CREAM, '#F2EFFA']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

            <SafeAreaView style={Styles.flexOne} edges={['top']}>
                {/* Header */}
                <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.marginTop16]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}>
                        <Icon name="arrow" size={scaleWidth(24)} color={PALETTE.TEXT_MAIN} style={{ transform: [{ rotate: '90deg' }] }} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[Styles.RubicBold, Styles.fontSize20, { color: PALETTE.TEXT_MAIN, marginLeft: 8 }]}>
                            My Wishlist
                        </Text>
                        <Text style={[Styles.rubicRegualr, { fontSize: 12, color: PALETTE.TEXT_LIGHT, marginLeft: 8 }]}>
                            What you're moving toward
                        </Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('in_progress')} style={[styles.tabButton, activeTab === 'in_progress' && styles.activeTab]}>
                        <Text style={[activeTab === 'in_progress' ? Styles.RubicBold : Styles.rubicMedium, { color: activeTab === 'in_progress' ? PALETTE.TEAL_MAIN : PALETTE.TEXT_LIGHT }]}>
                            Focusing On
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('completed')} style={[styles.tabButton, activeTab === 'completed' && styles.activeTab]}>
                        <Text style={[activeTab === 'completed' ? Styles.RubicBold : Styles.rubicMedium, { color: activeTab === 'completed' ? PALETTE.GOLD_ACCENT : PALETTE.TEXT_LIGHT }]}>
                            Aligned
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* List */}
                {isLoading ? (
                    <View style={[Styles.flexOne, Styles.center]}>
                        <ActivityIndicator size="small" color={PALETTE.TEAL_MAIN} />
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                        showsVerticalScrollIndicator={false}
                        style={{ paddingHorizontal: 16 }}
                    >
                        {filteredWishlist.length === 0 ? (
                            <View style={[Styles.center, Styles.marginTop48, { opacity: 0.6 }]}>
                                <Icon name="moon-stars" size={scaleWidth(40)} color={PALETTE.SAGE_DARK} />
                                <Text style={[Styles.rubicRegualr, Styles.fontSize16, Styles.marginTop16, Styles.textAlignCenter, { color: PALETTE.TEXT_LIGHT }]}>
                                    {activeTab === 'in_progress'
                                        ? "The space for your dreams is open. \nStart envisioning."
                                        : "No visions aligned yet. \nKeep moving forward."}
                                </Text>
                            </View>
                        ) : (
                            filteredWishlist.map((item, index) => (
                                <WishCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    navigation={navigation}
                                    onDelete={handleDelete}
                                    onAlign={handleAlign}
                                />
                            ))
                        )}
                    </ScrollView>
                )}

                {/* FAB */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('create-wishlist')}
                        style={styles.fab}
                    >
                        <Icon name='add-circle' color={'white'} size={40} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 8
    },
    tabButton: {
        marginRight: 24,
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: PALETTE.TEAL_MAIN
    },
    cardContainer: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        // Floating Shadow
        shadowColor: "#8DA399",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    imageContainer: {
        height: 140,
        width: '100%',
        justifyContent: 'space-between',
        padding: 16
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    statusChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    cardFooter: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    fabContainer: {
        position: 'absolute',
        bottom: 32,
        right: 24,
    },
    fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: PALETTE.TEAL_MAIN,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: PALETTE.TEAL_MAIN,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10
    }
});
