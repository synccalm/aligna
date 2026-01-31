/* File : setup-biometrics.tsx
 * Description : Calm Biometrics setup screen
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as RNB from '@sbaiahmed1/react-native-biometrics';
const ReactNativeBiometrics = (RNB as any).default || RNB;
const BiometryTypes = (RNB as any).BiometryTypes || { TouchID: 'TouchID', FaceID: 'FaceID', Biometrics: 'Biometrics' };
import { StorageHelper } from '../../../Helper/storage';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { Styles } from '../../../Theme';

export default function SetupBiometrics(): React.JSX.Element {
    const navigation = useNavigation<any>();
    const rnBiometrics = new ReactNativeBiometrics();

    const handleEnable = async () => {
        try {
            const { available } = await rnBiometrics.isSensorAvailable();
            if (available) {
                const { success } = await rnBiometrics.simplePrompt({
                    promptMessage: 'Confirm Biometrics',
                    fallbackPromptMessage: 'Use PIN',
                });

                if (success) {
                    const settings = await StorageHelper.getAuthSettings();
                    await StorageHelper.saveAuthSettings({
                        ...settings,
                        biometricEnabled: true,
                        authType: 'biometric'
                    });

                    finishSetup();
                }
            } else {
                Alert.alert("Not Available", "Biometrics not fully supported on this device.");
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const handleSkip = async () => {
        finishSetup();
    };

    const finishSetup = () => {
        // Reset nav stack to Tabs/Home
        navigation.reset({
            index: 0,
            routes: [{ name: 'tabs' }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
            <View style={styles.content}>
                <View style={[Styles.center, { flex: 1 }]}>
                    <View style={styles.iconCircle}>
                        <Icon name="card" size={scaleWidth(48)} color="#4DB6AC" />
                    </View>

                    <Text style={styles.title}>Unlock with a glance</Text>
                    <Text style={styles.subtitle}>
                        Enable biometrics for a faster, simpler way to enter your vision board.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleEnable} style={styles.primaryBtn}>
                        <Text style={styles.btnTextPrimary}>Enable Biometrics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSkip} style={styles.secondaryBtn}>
                        <Text style={styles.btnTextSecondary}>Skip for now</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E0F2F1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32
    },
    title: {
        fontFamily: 'Rubik-Medium',
        fontSize: 24,
        color: '#37474F',
        marginBottom: 16,
        textAlign: 'center'
    },
    subtitle: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        color: '#90A4AE',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24
    },
    footer: {
        paddingBottom: 24
    },
    primaryBtn: {
        backgroundColor: '#4DB6AC',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#4DB6AC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    secondaryBtn: {
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    btnTextPrimary: {
        fontFamily: 'Rubik-Medium',
        fontSize: 16,
        color: '#FFF'
    },
    btnTextSecondary: {
        fontFamily: 'Rubik-Medium',
        fontSize: 16,
        color: '#90A4AE'
    }
});
