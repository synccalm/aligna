import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { JournalEntry, StorageHelper } from '../../../Helper/storage';

type DetailRouteProp = RouteProp<{ params: { entry: JournalEntry } }, 'params'>;

export default function JournalDetail(): React.JSX.Element {
    const navigation = useNavigation();
    const route = useRoute<DetailRouteProp>();
    const { entry } = route.params;

    const handleDelete = () => {
        Alert.alert(
            'Delete Journal',
            'Are you sure you want to delete this entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await StorageHelper.deleteJournal(entry.id);
                        navigation.goBack();
                    }
                }
            ]
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
                <Text style={[Styles.rubicRegualr, Styles.fontSize14, { color: COLORS.SLATE }]}>
                    {entry.createdDate} • {entry.createdTime}
                </Text>
                <TouchableOpacity
                    onPress={handleDelete}
                    style={{ padding: 8 }}
                >
                    <Icon name="delete" size={scaleWidth(20)} color={COLORS.TANGERING} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[Styles.padding24]}>
                <Text style={[Styles.rubicMedium, Styles.fontSize24, { color: COLORS.CHARCOL, marginBottom: scaleWidth(24), lineHeight: 34 }]}>
                    {entry.title}
                </Text>

                <View style={{ height: 1, backgroundColor: 'rgba(57, 193, 203, 0.2)', marginBottom: scaleWidth(24) }} />

                <Text style={[Styles.rubicRegualr, Styles.fontSize16, { color: COLORS.CHARCOL, lineHeight: 28, letterSpacing: 0.5 }]}>
                    {entry.content}
                </Text>
            </ScrollView>
        </View>
    );
}
