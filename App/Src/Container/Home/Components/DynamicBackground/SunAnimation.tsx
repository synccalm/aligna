import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import { Styles } from '../../../../../Theme';
import { Icon } from '../../../../../Navigator/router';
import { scaleWidth } from '../../../../../Helper/responsive';

interface Props {
    type: 'morning' | 'noon';
}

export default function SunAnimation({ type }: Props) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Config based on type
    const color = type === 'morning' ? '#f7f2f1ff' : 'white'; // Orange-Red vs Gold
    const glowColor = type === 'morning' ? 'rgba(106, 175, 175, 0.4)' : 'rgba(106, 175, 175, 0.4)';
    const size = scaleWidth(60);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 3000,
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
                    transform: [{ scale: pulseAnim }],
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 20,
                    // Pseudo-glow
                    backgroundColor: glowColor,
                    borderRadius: size,
                    width: size,
                    height: size,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon name={type == 'noon'? "heart" : "cloudy"} size={scaleWidth(20)} color={color} />
            </Animated.View>
        </View>
    );
}
