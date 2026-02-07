/* File : store.tsx
 * Description : Premium Settings / Store Screen
 * Version : v1.0
 */

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Linking,
    Dimensions,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, AuthContext } from '../../../Navigator/router'; // Ensure this path is correct based on folder structure
import { Styles, COLORS } from '../../../Theme';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import EncryptedStorage from 'react-native-encrypted-storage';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
    { id: 'share', title: 'Share with friends', icon: 'link-3-1' },
    { id: 'rate', title: 'Rate Us', icon: 'star' },
    { id: 'feedback', title: 'Feedback', icon: 'chat-bubble' }, // fallback icon name, check router
    { id: 'privacy', title: 'Privacy Policy', icon: 'info' },
    { id: 'terms', title: 'Terms of Service', icon: 'order_icon' },
    { id: 'about', title: 'About Us', icon: 'about_us' },
    { id: 'logout', title: 'Logout', icon: 'logout' },
];

export default function Test(): React.JSX.Element {
    // Animation for fade-in
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const authContext = React.useContext(AuthContext);
    const signOut = authContext?.signOut;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = async (id: string) => {
        // Placeholder for actions
        console.log(`Pressed ${id}`);
        if (id === 'rate') {
            // Linking.openURL(...) 
        } else if (id === 'logout') {
            try {
                await auth().signOut();
                try {
                    await GoogleSignin.signOut();
                } catch (e) {
                    console.log('Google signout error (probably not signed in)', e);
                }
                if (signOut) signOut();
            } catch (error) {
                console.error('Logout error:', error);
                if (signOut) signOut();
            }
        }
    };

    async function _clear() {
        try {
            await EncryptedStorage.clear();
            console.log('Storage cleared');
            if (signOut) signOut();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    return (
        <View style={Styles.flexOne}>
            {/* Background - Very Subtle pure white/off-white */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFEFC' }]} />

            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <SafeAreaView style={Styles.flexOne} edges={['top', 'bottom']}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                    style={Styles.flexOne}
                >
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], paddingHorizontal: 24, paddingTop: 20 }}>

                        {/* 1. TOP SECTION — USER IDENTITY */}
                        <View style={{ marginBottom: 32, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: '#F5F5F5',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16
                            }}>
                                <Icon name="you-profile" size={20} color={COLORS.CHARCOL} style={{ opacity: 0.6 }} />
                            </View>
                            <View>
                                <Text style={{ fontFamily: 'Rubik-Medium', fontSize: 18, color: '#333' }}>
                                    Seeker #1087
                                </Text>
                                <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 13, color: '#888', marginTop: 2 }}>
                                    Conscious Member
                                </Text>
                            </View>
                        </View>

                        {/* 2. PREMIUM STATUS CARD */}
                        <View style={localStyles.premiumCard}>
                            {/* Soft Gradient Overlay */}
                            <LinearGradient
                                colors={['#BBDEFB', '#F4F1EA']}
                                style={StyleSheet.absoluteFill}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <View style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 12 }}>
                                    <Icon name="dazzle" size={54} color="#8D6E63" />
                                </View>
                            </View>

                            <Text style={{ fontFamily: 'Rubik-Medium', fontSize: 18, color: '#4E342E', marginBottom: 12 }}>
                                Premium Alignment
                            </Text>

                            <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 10, color: '#5D4037', lineHeight: 24, opacity: 0.9 }}>
                                - We prioritize intuition over interruption. {'\n'}
                                - Your peace is our priority. {'\n'}
                                - This sanctuary will remain forever free of advertisements. {'\n'}
                                - If this isn't what you seek, we wish you well on your journey.
                            </Text>
                        </View>

                        {/* 3. ACTION LIST */}
                        <View style={{ marginTop: 40 }}>
                            {MENU_ITEMS.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => handlePress(item.id)}
                                    activeOpacity={0.7}
                                    style={localStyles.menuItem}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 32, alignItems: 'center', marginRight: 16, opacity: 0.7 }}>
                                            <Icon name={item.icon === 'chat-bubble' ? 'ai-chat' : item.icon} size={20} color="#546E7A" />
                                        </View>
                                        <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 16, color: '#37474F' }}>
                                            {item.title}
                                        </Text>
                                    </View>
                                    <Icon name="arrow-right" size={16} color="#B0BEC5" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => _clear()}
                            style={{ padding: 20, margin: 20 }}>
                            <Text>
                                Clear all store for Test
                            </Text>
                        </TouchableOpacity>

                        {/* 4. FOOTER */}
                        <View style={{ marginTop: 60, marginBottom: 100, alignItems: 'center', opacity: 0.4 }}>
                            <Text style={{ fontFamily: 'Rubik-Medium', fontSize: 10, color: '#78909C', textTransform: 'uppercase', letterSpacing: 2 }}>
                                Designed with intention.
                            </Text>
                            <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 10, color: '#90A4AE', marginTop: 4 }}>
                                v1.2.0 • SyncCalm
                            </Text>
                        </View>

                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const localStyles = StyleSheet.create({
    premiumCard: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: "#8D6E63",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
        position: 'relative',

    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    }
});
