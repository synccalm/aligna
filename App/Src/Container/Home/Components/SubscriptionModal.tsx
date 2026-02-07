
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    useIAP,
    requestPurchase,
    finishTransaction,
    Purchase
} from 'react-native-iap';
import { Icon } from '../../../../Navigator/router'; // Adjust path if needed: Home/Components -> ../../../Navigator
// Actually path is App/Src/Container/Home/Components/SubscriptionModal.tsx
// Router is App/Navigator/router -> ../../../Navigator/router ??
// Home is App/Src/Container/Home/home.tsx.
// Router is imported as `import { Icon } from '../../../Navigator/router';` in home.tsx.
// So from `Components/SubscriptionModal.tsx`, it's `../../../../Navigator/router`.

import { COLORS } from '../../../../Theme'; // ../../../Theme
// home.tsx: `import { Styles, COLORS } from '../../../Theme';`
// Components/SubscriptionModal.tsx -> `../../../../Theme`

const { width } = Dimensions.get('window');

// -- IAP CONFIG --
const productIds = Platform.select({
    ios: [
        'aligna.premium.monthly',
        'aligna.premium.yearly',
    ],
    android: [
        'aligna.premium.yearly',
        'aligna.premium.monthly',
    ],
});

interface SubscriptionModalProps {
    // onStatusChange?: (isSubscribed: boolean) => void; 
    // User said "home.tsx only connect and purchase status is required". 
    // I'll expose a callback if needed, but for now just handle logic internally.
    // Actually, if Home needs to know, I should propagate it.
    onSubscriptionComplete?: () => void;
}

const SubscriptionModal = ({ onSubscriptionComplete }: SubscriptionModalProps) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSku, setLoadingSku] = useState<string | null>(null);

    const {
        connected,
        products,
        getProducts,
        finishTransaction,
        currentPurchase,
        currentPurchaseError,
        getAvailablePurchases
    } = useIAP();

    useEffect(() => {
        if (connected) {
            getProducts({ skus: productIds || [] });
            checkSubscription();
        }
    }, [connected, getProducts]);

    const checkSubscription = async () => {
        try {
            const purchases = await getAvailablePurchases();
            if (purchases && purchases.length > 0) {
                setVisible(false);
                if (onSubscriptionComplete) onSubscriptionComplete();
            } else {
                setVisible(true);
            }
        } catch (err) {
            console.warn('checkSubscription error:', err);
            // In case of error (e.g. simulator), we might default to showing or hiding? 
            // For safety/spam prevention, maybe hide or show? 
            // User reported spamming error.
            // If error, let's just log and NOT show modal to avoid blocking user if IAP is broken?
            // Or show modal? "Unlock Premium" implies they can't use app without it?
            // Let's safe fail -> show modal (so they can try to buy) BUT if getAvailablePurchases fails, requestPurchase might too.
            // I'll default to visible=false if error persists to avoid trapping user?
            // Actually, standard is to assume NOT subscribed if error, so show modal.
            // But I will suppress alert spam.
        }
    };

    const handlePurchase = async (sku: string) => {

        console.log("HERE .. .. . . .. . . .")
        setLoading(true);
        setLoadingSku(sku);
        try {
            await requestPurchase({ sku });
        } catch (err: any) {
            console.warn(err.code, err.message);
            Alert.alert('Purchase Error', err.message);
            setLoading(false);
            setLoadingSku(null);
        }
    };

    // Transaction Listener
    useEffect(() => {
        const checkCurrentPurchase = async (purchase: Purchase) => {
            if (purchase) {
                const receipt = purchase.transactionReceipt;
                if (receipt) {
                    try {
                        const ackResult = await finishTransaction({ purchase, isConsumable: false });
                        console.log('ackResult', ackResult);
                    } catch (ackErr) {
                        console.warn('ackErr', ackErr);
                    }

                    setVisible(false);
                    Alert.alert('Success', 'Thank you for your purchase!');
                    if (onSubscriptionComplete) onSubscriptionComplete();
                }
            }
            setLoading(false);
            setLoadingSku(null);
        };

        if (currentPurchase) {
            checkCurrentPurchase(currentPurchase);
        }
    }, [currentPurchase, finishTransaction]);

    useEffect(() => {
        if (currentPurchaseError) {
            Alert.alert('Error', 'Purchase Failed or Cancelled');
            setLoading(false);
            setLoadingSku(null);
        }
    }, [currentPurchaseError]);


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                // Prevent closing if strict? Or allow closing?
                // User didn't specify strict or loose. 
                // Previous code allowed closing via "close" button but not back button? 
                // Previous code had `onRequestClose={onClose}`.
                // Let's assume users can close it? 
                // Users usually want to close it.
                setVisible(false);
            }}
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: '#FFFEFC', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 50, minHeight: '60%' }}>

                    {/* Close Button - Optional, if we want to allow skipping */}
                    <TouchableOpacity onPress={() => setVisible(false)} style={{ alignSelf: 'flex-end', padding: 8 }}>
                        <Icon name="close" size={24} color={COLORS.CHARCOL} />
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        <View style={{ padding: 16, backgroundColor: '#F3E5F5', borderRadius: 20, marginBottom: 16 }}>
                            <Icon name="dazzle" size={48} color="#8E24AA" />
                        </View>
                        <Text style={{ fontFamily: 'Rubik-Medium', fontSize: 24, color: '#333', textAlign: 'center', marginBottom: 8 }}>
                            Unlock Aligna Premium
                        </Text>
                        <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 }}>
                            Prioritize intuition over interruption. Provides continued access to all features of Aligna.
                        </Text>
                    </View>

                    {/* Features List */}
                    <View style={{ marginBottom: 32 }}>
                        {[
                            'A distraction-free experience',
                            'Continued access to all future updates'
                        ].map((feature, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 16 }}>
                                <Icon name="tick-circle-green" size={18} color="#4CAF50" />
                                <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 14, color: '#444', marginLeft: 12 }}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Subscription Options */}
                    {(products && products.length > 0 ? products : []).map((product: any) => (
                        <TouchableOpacity
                            key={product.productId}
                            activeOpacity={0.8}
                            onPress={() => handlePurchase(product.productId)}
                            style={{
                                backgroundColor: product.productId.includes('premium') ? '#1D3639' : '#FFF',
                                paddingVertical: 16,
                                borderRadius: 16,
                                marginBottom: 12,
                                borderWidth: product.productId.includes('premium') ? 0 : 2,
                                borderColor: '#1D3639',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 24,
                                alignItems: 'center',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 8.0,
                                elevation: 4,
                            }}
                        >
                            <View>
                                <Text style={{ fontFamily: 'Rubik-Medium', fontSize: 16, color: product.productId.includes('premium') ? '#FFF' : '#1D3639' }}>{product.title}</Text>
                                {product.introPrice && <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 12, color: '#B2DFDB' }}>{product.introPrice}</Text>}
                            </View>

                            {loadingSku === product.productId ? (
                                <ActivityIndicator color={product.productId.includes('premium') ? "#FFF" : "#1D3639"} />
                            ) : (
                                <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 16, color: product.productId.includes('premium') ? '#FFF' : '#1D3639' }}>{product.price}</Text>
                            )}
                        </TouchableOpacity>
                    ))}


                    <Text style={{ fontFamily: 'Rubik-Regular', fontSize: 10, color: '#999', textAlign: 'center', marginTop: 16 }}>
                        Recurring billing. Cancel anytime.
                    </Text>

                </View>
            </View>
        </Modal>
    );
};

export default SubscriptionModal;
