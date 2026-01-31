/* File : board.tsx
 * Description : Aesthetic Vision Board with organic pinned wishes
 * Author : SyncCalm
 * Version : v2.0 (Redesign)
 */

import React, { useCallback, useState, useMemo } from 'react';
import {
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Styles, COLORS } from '../../../Theme';
import { myEdges } from '../../../Helper/type-models';
import { StorageHelper, WishlistItem } from '../../../Helper/storage';
import { scaleWidth } from '../../../Helper/responsive';
import { Icon } from '../../../Navigator/router';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 48; // Generous padding

// Single Create Card for empty state
const CREATE_WISH_CARD: WishlistItem[] = [
    {
        id: 'create_wish',
        title: 'Create Your Wish ✨',
        createdAt: Date.now(),
        reminderEnabled: false,
        status: 'in_progress',
        image: undefined,
        description: 'Tap to start manifesting'
    }
];

export default function Board(): React.JSX.Element {
    const navigation = useNavigation<any>();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const loadData = async () => {
        setIsLoading(true);
        const wishes = await StorageHelper.getWishlist();
        setWishlist(wishes.reverse());
        setIsLoading(false);
    };

    const displayWishes = wishlist.length > 0 ? wishlist : CREATE_WISH_CARD;
    const isEmptyState = wishlist.length === 0;

    // Deterministic random rotation based on index to keep layout stable
    const getRotation = (index: number) => {
        const rotations = ['-2deg', '1.5deg', '-1deg', '3deg', '-3deg', '2deg'];
        return rotations[index % rotations.length];
    };

    return (
        <SafeAreaView style={[Styles.flexOne, { backgroundColor: '#FDFBF7' }]} edges={myEdges}>
            <StatusBar barStyle={'dark-content'} backgroundColor='#FDFBF7' />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Year Header */}
                <View style={{ marginTop: 40, marginBottom: 30, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 42, color: COLORS.CHARCOL, letterSpacing: -1 }}>
                        2026
                    </Text>
                    <Text style={[Styles.rubicRegualr, { fontSize: 14, color: COLORS.SLATE, marginTop: 4, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.6 }]}>
                        Vision Board
                    </Text>
                </View>

                {/* The Board */}
                <View style={localStyles.boardContainer}>
                    {/* Board Texture/Shadow */}
                    <View style={localStyles.boardBackground} />

                    {/* Board Content */}
                    <View style={localStyles.boardContent}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={COLORS.TEAL} style={{ marginTop: 40 }} />
                        ) : (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {displayWishes.map((item, index) => (
                                    <PinCard
                                        key={item.id}
                                        item={item}
                                        rotation={getRotation(index)}
                                        onPress={() => {
                                            if (!isEmptyState) {
                                                navigation.navigate('wishlist-details', { item });
                                            } else {
                                                // If in empty state, maybe go to create?
                                                navigation.navigate('create-wishlist');
                                            }
                                        }}
                                        isDummy={isEmptyState}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Footer Quote */}
                        <View style={{ marginTop: 50, paddingHorizontal: 60 }}>
                            <Text style={[Styles.rubicRegualr, { textAlign: 'center', fontSize: 14, color: '#A0A0A0', fontStyle: 'italic', lineHeight: 22 }]}>
                                "The future belongs to those who believe in the beauty of their dreams."
                            </Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const PinCard = ({ item, rotation, onPress, isDummy }: { item: WishlistItem, rotation: string, onPress: () => void, isDummy?: boolean }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[
                localStyles.pinCard,
                { transform: [{ rotate: rotation }] },
                isDummy && { opacity: 0.7 }
            ]}
        >
            {/* The Pin (Visual) */}
            <View style={localStyles.pinHead} />

            {/* Image Area */}
            <View style={localStyles.cardImageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={localStyles.cardImage} resizeMode="cover" />
                ) : (
                    <LinearGradient
                        colors={['#EDF2F4', '#E6EBEF']}
                        style={localStyles.cardImage}
                    >
                        <Icon name={item.id === 'create_wish' ? 'add-circle' : 'star'} size={24} color={item.id === 'create_wish' ? COLORS.TEAL : "#D0D6DA"} style={{ opacity: item.id === 'create_wish' ? 1 : 0.5 }} />
                    </LinearGradient>
                )}
            </View>

            {/* Title */}
            <Text numberOfLines={2} style={[Styles.rubicMedium, { fontSize: 12, color: COLORS.CHARCOL, textAlign: 'center', marginTop: 8, lineHeight: 16 }]}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    boardContainer: {
        width: BOARD_SIZE,
        minHeight: BOARD_SIZE * 1.2, // Slightly vertical rectangular or square
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    boardBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F7F5F0', // Slightly darker than main bg for contrast
        borderRadius: 4,
        borderWidth: 8,
        borderColor: '#FFF',
        shadowColor: '#8D6E63',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 200
    },
    boardContent: {
        width: '100%',
        height: '100%',
        paddingVertical: 20,
    },
    pinCard: {
        width: (BOARD_SIZE - 100) / 2, // 2 columns: BOARD_SIZE - (BoardPadding*2 + CardMargin*2 + Spacing) -> approx 70
        backgroundColor: '#FFF',
        margin: 8,
        padding: 10,
        paddingBottom: 16,
        paddingTop: 16, // Space for pin
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    cardImageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pinHead: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E57373', // Red pin or maybe Gold? Let's go soft red.
        position: 'absolute',
        top: -6,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        zIndex: 10,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)'
    }
});
