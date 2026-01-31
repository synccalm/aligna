/* File : unlock-screen.tsx
 * Description : Calm Unlock Screen
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as RNB from '@sbaiahmed1/react-native-biometrics';
const ReactNativeBiometrics = (RNB as any).default || RNB;
import { StorageHelper } from '../../../Helper/storage';
import { AuthContext, Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';

export default function UnlockScreen(): React.JSX.Element {
    const navigation = useNavigation<any>();
    const rnBiometrics = new ReactNativeBiometrics();
    const { unlockApp } = React.useContext(AuthContext);

    // State
    const [pin, setPin] = useState<string>('');
    const [savedPin, setSavedPin] = useState<string | null>(null);
    const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);

    // Load Settings
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const settings = await StorageHelper.getAuthSettings();
        setSavedPin(settings.pinHash);
        setBiometricEnabled(settings.biometricEnabled);

        if (settings.biometricEnabled || settings.authType === 'biometric') {
            promptBiometrics();
        }
    };

    const promptBiometrics = async () => {
        try {
            const { success } = await rnBiometrics.simplePrompt({
                promptMessage: 'Unlock SyncCalm',
                fallbackPromptMessage: 'Use PIN',
            });
            if (success) handleSuccess();
        } catch (e) {
            console.log('Biometric failed or cancelled', e);
        }
    };

    const handleSuccess = () => {
        if (unlockApp) {
            unlockApp();
        } else {
            // Fallback
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.replace('tabs');
        }
    };

    const handlePress = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                // Verify
                if (newPin === savedPin) {
                    handleSuccess();
                } else {
                    Alert.alert("Unlock Failed", "Incorrect PIN. Take a breath and try again.", [
                        { text: "OK", onPress: () => setPin('') }
                    ]);
                }
            }
        }
    };

    const handleDelete = () => setPin(prev => prev.slice(0, -1));

    // --- Render logic same as SetupPin but simplified ---
    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {[0, 1, 2, 3].map((i) => (
                <View
                    key={i}
                    style={[
                        styles.dot,
                        pin.length > i && styles.dotActive
                    ]}
                />
            ))}
        </View>
    );

    const renderKeypad = () => (
        <View style={styles.keypad}>
            {[[1, 2, 3], [4, 5, 6], [7, 8, 9], [biometricEnabled ? 'bio' : '', 0, 'del']].map((row, rIdx) => (
                <View key={rIdx} style={styles.keypadRow}>
                    {row.map((item, cIdx) => {
                        if (item === '') return <View key={cIdx} style={styles.keyButton} />;

                        if (item === 'bio') return (
                            <TouchableOpacity key={cIdx} onPress={promptBiometrics} style={[styles.keyButton, { backgroundColor: 'transparent', borderWidth: 0 }]}>
                                <Icon name="card" size={scaleWidth(28)} color="#4DB6AC" />
                            </TouchableOpacity>
                        );

                        if (item === 'del') return (
                            <TouchableOpacity key={cIdx} onPress={handleDelete} style={[styles.keyButton, { backgroundColor: 'transparent', borderWidth: 0 }]}>
                                <Text style={[styles.keyText, { fontSize: 18 }]}>Delete</Text>
                            </TouchableOpacity>
                        );

                        return (
                            <TouchableOpacity
                                key={cIdx}
                                style={styles.keyButton}
                                onPress={() => handlePress(item.toString())}
                            >
                                <Text style={styles.keyText}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#263238" />
            <View style={styles.content}>
                <Icon name="locked" size={scaleWidth(32)} color="#FFF" style={{ marginBottom: 24, opacity: 0.8 }} />
                <Text style={styles.title}>Welcome Back</Text>

                {renderDots()}
                {renderKeypad()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#263238', // Dark elegant theme for Unlock
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 100,
    },
    title: {
        fontFamily: 'Rubik-Medium',
        fontSize: 20,
        color: '#FFF',
        marginBottom: 48,
        opacity: 0.9
    },
    dotsContainer: {
        flexDirection: 'row',
        marginBottom: 60,
        height: 20
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 12,
    },
    dotActive: {
        backgroundColor: '#FFF'
    },
    keypad: {
        width: '80%',
        maxWidth: 320
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32
    },
    keyButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 28,
        color: '#FFF'
    }
});
