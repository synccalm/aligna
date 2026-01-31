import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { Styles } from '../../../../../Theme';
import { Icon } from '../../../../../Navigator/router';
import { scaleWidth } from '../../../../../Helper/responsive';

interface Props {
    type: 'evening' | 'night';
}

export default function MoonAnimation({ type }: Props) {
    const floatAnim = useRef(new Animated.Value(0)).current;

    // Config
    const color = type === 'evening' ? '#f9d6b7ff' : '#FDFBD3'; // Amber vs Pale White
    const size = scaleWidth(type === 'evening' ? 30 : 80);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [type]);

    return (
        <View style={[Styles.center, { height: 150 }]}>
            <Animated.View
                style={{
                    transform: [{ translateY: floatAnim }],
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 15,
                }}
            >
                <Icon name= {type == 'evening' ? "cloud2" : "moon-stars1"} size={size} color={color} />
            </Animated.View>
        </View>
    );
}
