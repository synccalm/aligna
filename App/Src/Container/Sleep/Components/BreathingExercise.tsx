import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, Easing } from 'react-native';
import { COLORS, Styles } from '../../../../Theme';

interface Props {
    onClose: () => void;
}

type Mode = '4-7-8' | 'Box';

export default function BreathingExercise({ onClose }: Props) {
    const [mode, setMode] = useState<Mode>('4-7-8');
    const [instruction, setInstruction] = useState<string>('Inhale');

    // Animation Value for Circle Scale (1 = Normal, 1.5 = Expanded)
    const breathVal = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let isRunning = true;

        const breathe478 = async () => {
            while (isRunning) {
                setInstruction("Inhale (4s)");
                await animateBreath(1.8, 4000); // 4s Inhale

                if (!isRunning) break;
                setInstruction("Hold (7s)");
                await delay(7000); // 7s Hold

                if (!isRunning) break;
                setInstruction("Exhale (8s)");
                await animateBreath(1, 8000); // 8s Exhale
            }
        };

        const breatheBox = async () => {
            while (isRunning) {
                setInstruction("Inhale (4s)");
                await animateBreath(1.8, 4000);

                if (!isRunning) break;
                setInstruction("Hold (4s)");
                await delay(4000);

                if (!isRunning) break;
                setInstruction("Exhale (4s)");
                await animateBreath(1, 4000);

                if (!isRunning) break;
                setInstruction("Hold (4s)");
                await delay(4000);
            }
        };

        if (mode === '4-7-8') {
            breathe478();
        } else {
            breatheBox();
        }

        return () => {
            isRunning = false;
            breathVal.stopAnimation();
        };
    }, [mode]);

    const animateBreath = (toScale: number, duration: number) => {
        return new Promise<void>((resolve) => {
            Animated.timing(breathVal, {
                toValue: toScale,
                duration: duration,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) resolve();
            });
        });
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' }]}>

            {/* Mode Switcher */}
            <View style={{ position: 'absolute', top: 50, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setMode('4-7-8')} style={[styles.pill, mode === '4-7-8' && styles.activePill]}>
                    <Text style={[styles.text, mode === '4-7-8' && styles.activeText]}>4-7-8</Text>
                </TouchableOpacity>
                <View style={{ width: 10 }} />
                <TouchableOpacity onPress={() => setMode('Box')} style={[styles.pill, mode === 'Box' && styles.activePill]}>
                    <Text style={[styles.text, mode === 'Box' && styles.activeText]}>Box Breathing</Text>
                </TouchableOpacity>
            </View>

            {/* Breathing Circle */}
            <Animated.View style={[styles.circle, { transform: [{ scale: breathVal }] }]}>
                {/* Inner Gradient Circle visuals could go here */}
            </Animated.View>

            {/* Instruction Text */}
            <Text style={[Styles.RubicBold, Styles.fontSize32, { color: COLORS.WHITE_SMOKE, marginTop: 50, textAlign: 'center' }]}>
                {instruction}
            </Text>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={[Styles.rubicMedium, { color: '#FF6B6B' }]}>Stop</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.TEAL, // Calm color
        opacity: 0.8,
        shadowColor: COLORS.TEAL,
        shadowRadius: 20,
        shadowOpacity: 0.5,
    },
    pill: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#333',
    },
    activePill: {
        backgroundColor: COLORS.TEAL,
    },
    text: {
        color: '#888',
        fontWeight: '600'
    },
    activeText: {
        color: 'white',
    },
    closeBtn: {
        position: 'absolute',
        bottom: 50,
        padding: 16,
    }
});
