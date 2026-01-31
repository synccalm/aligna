import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Switch } from 'react-native';
import { COLORS, Styles } from '../../../../Theme';
import { StorageHelper } from '../../../../Helper/storage';
import Toast from 'react-native-toast-message';
import { Icon } from '../../../../Navigator/router';
import { scaleWidth } from '../../../../Helper/responsive';

interface Props {
    onClose: () => void;
}

export default function SleepReminder({ onClose }: Props) {
    const [enabled, setEnabled] = useState(false);
    const [time, setTime] = useState('22:00'); // Simple text input for now, ideally DatePicker

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const settings = await StorageHelper.getSleepSettings();
        setEnabled(settings.reminderEnabled);
        setTime(settings.reminderTime);
    };

    const save = async () => {
        await StorageHelper.saveSleepSettings({
            reminderEnabled: enabled,
            reminderTime: time,
            nightModeEnabled: false // Preserving other setting would be better, but simplifying for now
        });

        Toast.show({
            type: 'success',
            text1: enabled ? `Reminder set for ${time}` : 'Reminder disabled',
            position: 'bottom'
        });
        onClose();
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.card}>
                <View style={[Styles.row, Styles.spaceBetween, Styles.alignItemsCenter, Styles.marginBottom24]}>
                    <Text style={[Styles.RubicBold, Styles.fontSize16, { color: COLORS.CHARCOL }]}>Sleep Reminder</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" size={24} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Enable Toggle */}
                <View style={[Styles.row, Styles.spaceBetween, Styles.alignItemsCenter, Styles.marginBottom16]}>
                    <Text style={[Styles.rubicMedium, { color: COLORS.CHARCOL }]}>Enable Reminder</Text>
                    <Switch
                        value={enabled}
                        onValueChange={setEnabled}
                        trackColor={{ false: "#767577", true: COLORS.TEAL }}
                    />
                </View>

                {/* Time Input */}
                {enabled && (
                    <View style={Styles.marginBottom24}>
                        <Text style={[Styles.rubicRegualr, { color: '#666', marginBottom: 8 }]}>Time (HH:MM)</Text>
                        <TextInput
                            value={time}
                            onChangeText={setTime}
                            style={styles.input}
                            placeholder="22:00"
                            keyboardType="numbers-and-punctuation"
                            maxLength={5}
                        />
                        <Text style={[Styles.fontSize10, { color: '#999', marginTop: 4 }]}>
                            We'll remind you gently.
                        </Text>
                    </View>
                )}

                <TouchableOpacity onPress={save} style={[Styles.center, Styles.borderRadius8, { backgroundColor: COLORS.TEAL, padding: 12 }]}>
                    <Text style={[Styles.rubicMedium, { color: 'white' }]}>Save Settings</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        elevation: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333'
    }
});
