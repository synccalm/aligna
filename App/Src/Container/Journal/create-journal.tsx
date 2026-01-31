import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { StorageHelper, JournalEntry } from '../../../Helper/storage';
import AIQ from '../../Components/Other/ai-question';

export default function CreateJournal(): React.JSX.Element {
    const navigation = useNavigation();
    // 1 = Title, 2 = Content
    const [step, setStep] = useState<1 | 2>(1);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (step === 1) {
            if (!title.trim()) {
                Alert.alert('Required', 'Please enter a name for your dream or thought.');
                return;
            }
            setStep(2);
        }
    };

    const handleSave = async () => {
        if (!content.trim()) {
            Alert.alert('Empty Journal', 'Please write something before saving.');
            return;
        }

        setLoading(true);

        const now = new Date();

        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            title: title.trim(),
            content: content,
            createdDate: now.toLocaleDateString(),
            createdTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: now.getTime()
        };

        await StorageHelper.saveJournal(newEntry);
        setLoading(false);
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[Styles.flexOne, { backgroundColor: '#FBFCFC' }]}
        >
            <View style={[Styles.flexOne]}>
                {/* Header */}
                <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.spaceBetween, { marginTop: scaleWidth(40) }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ padding: 8 }}
                    >
                        <Icon name="arrow-left" size={scaleWidth(24)} color={COLORS.CHARCOL} />
                    </TouchableOpacity>
                    <Text style={[Styles.rubicMedium, Styles.fontSize20, { color: COLORS.CHARCOL }]}>New Entry</Text>
                    <View style={{ width: scaleWidth(40) }} />
                </View>

                <ScrollView contentContainerStyle={[Styles.padding16]}>
                    <View style={{ marginTop: scaleWidth(20) }}>
                        {step === 1 ? (
                            <AIQ
                                question="What is the name of your dream or thought?"
                                type="input"
                                value={title}
                                onChangeText={setTitle}
                                showSave={false}
                                onSubmit={handleNext}
                            />
                        ) : (
                            <AIQ
                                question="Write your dream or mind in detail..."
                                type="input"
                                value={content}
                                onChangeText={setContent}
                                showSave={true}
                                onSave={handleSave}
                                onSubmit={() => { }}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}
