/* File : setup-pin.tsx
 * Description : Calm PIN setup screen
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { StorageHelper } from '../../../Helper/storage';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { Styles } from '../../../Theme';

export default function SetupPin(): React.JSX.Element {
    const navigation = useNavigation<any>();
    const [pin, setPin] = useState<string>('');
    const [confirmPin, setConfirmPin] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    // Animation refs
    const dotScale = [1, 2, 3, 4].map(() => new Animated.Value(1));

    const handlePress = (num: string) => {
        const currentVal = isConfirming ? confirmPin : pin;
        if (currentVal.length < 4) {
            const newVal = currentVal + num;
            if (isConfirming) {
                setConfirmPin(newVal);
                if (newVal.length === 4) validatePin(newVal);
            } else {
                setPin(newVal);
                if (newVal.length === 4) {
                    setTimeout(() => setIsConfirming(true), 300);
                }
            }
        }
    };

    const handleDelete = () => {
        if (isConfirming) {
            setConfirmPin(prev => prev.slice(0, -1));
        } else {
            setPin(prev => prev.slice(0, -1));
        }
    };

    const validatePin = (finalConfirm: string) => {
        if (pin === finalConfirm) {
            // Success
            savePin(pin);
        } else {
            // Mismatch
            Alert.alert("Pins don't match", "Let's try again with a calm breath.", [
                {
                    text: "Retry", onPress: () => {
                        setPin('');
                        setConfirmPin('');
                        setIsConfirming(false);
                    }
                }
            ]);
        }
    };

    const savePin = async (finalPin: string) => {
        // In a real app, hash this pin. For now, simple storage.
        await StorageHelper.saveAuthSettings({
            hasAuthSetup: true,
            pinHash: finalPin, // TODO: SHA-256 Hash
            biometricEnabled: false,
            authType: 'pin'
        });

        // Navigate to Biometrics setup or finish
        navigation.replace('setup-biometrics');
    };

    const renderDots = () => {
        const val = isConfirming ? confirmPin : pin;
        return (
            <View style={styles.dotsContainer}>
                {[0, 1, 2, 3].map((i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            val.length > i && styles.dotActive,
                            { transform: [{ scale: val.length === i + 1 ? 1.2 : 1 }] } // subtle pop
                        ]}
                    />
                ))}
            </View>
        );
    };

    const renderKeypad = () => (
        <View style={styles.keypad}>
            {[[1, 2, 3], [4, 5, 6], [7, 8, 9], ['', 0, 'del']].map((row, rIdx) => (
                <View key={rIdx} style={styles.keypadRow}>
                    {row.map((item, cIdx) => {
                        if (item === '') return <View key={cIdx} style={styles.keyButton} />;
                        if (item === 'del') return (
                            <TouchableOpacity key={cIdx} onPress={handleDelete} style={styles.keyButton}>
                                <Icon name="arrow" size={scaleWidth(24)} color="#546E7A" style={{ transform: [{ rotate: '180deg' }] }} />
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
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
            <View style={styles.content}>
                <Icon name="locked" size={scaleWidth(40)} color="#4DB6AC" style={{ marginBottom: 24 }} />

                <Text style={styles.title}>
                    {isConfirming ? "Confirm your PIN" : "Secure your space"}
                </Text>
                <Text style={styles.subtitle}>
                    {isConfirming ? "Re-enter to verify" : "Create a 4-digit PIN for peace of mind"}
                </Text>

                {renderDots()}

                {renderKeypad()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
    },
    title: {
        fontFamily: 'Rubik-Medium',
        fontSize: 24,
        color: '#37474F',
        marginBottom: 12
    },
    subtitle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        color: '#90A4AE',
        marginBottom: 48
    },
    dotsContainer: {
        flexDirection: 'row',
        marginBottom: 60,
        height: 20
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4DB6AC',
        marginHorizontal: 12,
    },
    dotActive: {
        backgroundColor: '#4DB6AC'
    },
    keypad: {
        width: '80%',
        maxWidth: 320
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24
    },
    keyButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ECEFF1'
    },
    keyText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 28,
        color: '#37474F'
    }
});
