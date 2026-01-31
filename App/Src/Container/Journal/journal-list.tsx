import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { StorageHelper, JournalEntry } from '../../../Helper/storage';
import { LinearGradient } from 'react-native-linear-gradient';

export default function JournalList(): React.JSX.Element {
    const navigation = useNavigation();
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const loadJournals = async () => {
        setLoading(true);
        const data = await StorageHelper.getJournals();
        // Sort by timestamp descending
        const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
        setJournals(sorted);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadJournals();
        }, [])
    );

    const renderItem = ({ item }: { item: JournalEntry }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('journal-detail' as never, { entry: item } as never)}
                style={[
                    Styles.cardShadow,
                    {
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        padding: scaleWidth(20),
                        marginBottom: scaleWidth(16),
                        elevation: 4,
                        borderWidth: 1,
                        borderColor: 'rgba(233, 188, 139, 0.2)' // Soft tangerine border
                    }
                ]}
            >
                <View style={[Styles.row, Styles.spaceBetween, Styles.alignItemsCenter, Styles.marginBottom8]}>
                    <Text style={[Styles.rubicMedium, Styles.fontSize10, { color: COLORS.TEAL, letterSpacing: 1 }]}>
                        {item.createdDate.toUpperCase()}
                    </Text>
                    <Text style={[Styles.rubicRegualr, Styles.fontSize10, { color: COLORS.SLATE }]}>
                        {item.createdTime}
                    </Text>
                </View>

                <Text
                    numberOfLines={2}
                    style={[Styles.rubicMedium, Styles.fontSize16, { color: COLORS.CHARCOL, lineHeight: 24 }]}
                >
                    {item.title}
                </Text>

                <Text
                    numberOfLines={2}
                    style={[Styles.rubicRegualr, Styles.fontSize12, { color: COLORS.SLATE, marginTop: 8, lineHeight: 18 }]}
                >
                    {item.content}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[Styles.flexOne, { backgroundColor: '#FBFCFC' }]}>
            {/* Header */}
            <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.spaceBetween, { marginTop: scaleWidth(40) }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ padding: 8 }}
                >
                    <Icon name="arrow-left" size={scaleWidth(24)} color={COLORS.CHARCOL} />
                </TouchableOpacity>
                <Text style={[Styles.rubicMedium, Styles.fontSize20, { color: COLORS.CHARCOL }]}>Dream Journal</Text>
                <View style={{ width: scaleWidth(40) }} />
            </View>

            <FlatList
                data={journals}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[Styles.padding16, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadJournals} tintColor={COLORS.TEAL} />}
                ListEmptyComponent={
                    !loading ? (
                        <View style={[Styles.center, { marginTop: scaleWidth(100) }]}>
                            <Icon name="edit" size={scaleWidth(40)} color={COLORS.SLATE} />
                            <Text style={[Styles.rubicRegualr, Styles.fontSize14, { color: COLORS.SLATE, marginTop: 16, textAlign: 'center' }]}>
                                No journals yet.{'\n'}Start manifesting your dreams today.
                            </Text>
                        </View>
                    ) : null
                }
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('create-journal' as never)}
                style={[
                    Styles.cardShadow,
                    Styles.center,
                    {
                        position: 'absolute',
                        bottom: scaleWidth(30),
                        right: scaleWidth(20),
                        width: scaleWidth(56),
                        height: scaleWidth(56),
                        borderRadius: scaleWidth(28),
                        backgroundColor: COLORS.TEAL,
                        elevation: 8
                    }
                ]}
            >
                <Icon name="add-circle" size={scaleWidth(24)} color={COLORS.WHITE_SMOKE} />
            </TouchableOpacity>
        </View>
    );
}
