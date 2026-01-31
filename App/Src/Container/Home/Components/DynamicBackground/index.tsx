import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Styles, COLORS } from '../../../../../Theme';

import SunAnimation from './SunAnimation';
import MoonAnimation from './MoonAnimation';
import StarField from './StarField';
import SnowFall from './SnowFall';
import FallingAlignaIcons from './FallingAlignaIcons';

type TimePeriod = 'morning' | 'noon' | 'evening' | 'night';

interface Props {
    children?: React.ReactNode;
}

export default function DynamicBackground({ children }: Props) {
    const [period, setPeriod] = useState<TimePeriod>('morning');

    useEffect(() => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) setPeriod('morning');
        else if (hour >= 12 && hour < 17) setPeriod('noon');
        else if (hour >= 17 && hour < 21) setPeriod('evening');
        else setPeriod('night');
    }, []);

    const getGradientColors = () => {
        switch (period) {
            case 'morning': return ['rgba(245, 176, 151, 0.6)', 'rgba(130, 200, 200, 0.5)']; // Semi-transparent Warm peach
            case 'noon': return ['rgba(238, 242, 245, 0)', 'rgba(79, 138, 143, 0.5)']; // Semi-transparent Blue
            case 'evening': return ['rgba(146, 96, 77, 0.6)', 'rgba(79, 138, 143, 0.5)']; // Semi-transparent Sunset
            case 'night': return ['rgba(0, 4, 40, 1)', 'rgba(79, 138, 143, 0.5)']; // Darker overlay for night
            default: return ['rgba(79, 138, 143, 0.5)', 'rgba(79, 138, 143, 0.5)'];
        }
    };

    const gradientColors = getGradientColors();

    

    return (
        <View style={{ height: 400, overflow: 'hidden', width: '100%' }}>
            <ImageBackground
                source={require('../../../../../Assets/img/athlete.jpg')}
                style={[StyleSheet.absoluteFill]}
                resizeMode="cover"
            >
                {/* Gradient Overlay */}
                <LinearGradient
                    colors={gradientColors}
                    style={[StyleSheet.absoluteFill]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.6 }}
                />

                {/* Celestial Elements */}
                <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]}>
                    {/* Night Extras */}
                    {period === 'night' && <StarField />}
                    {period === 'night' && <SnowFall />}

                    {/* Non-Night Extras - Falling Icons */}
                    {period !== 'night' && <FallingAlignaIcons />}

                    {/* Celestial Object Centered */}
                    <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }, (period === 'morning' || period === 'noon' || period === 'evening') && { alignItems: 'flex-start', marginLeft: 70 }]}>
                        {/* Morning/Noon Sun */}
                        {/* {(period === 'morning' || period === 'noon') && (
                            <SunAnimation type={period} />
                        )} */}

                        {/* Evening/Night Moon */}
                        {(period === 'night') && (
                            <MoonAnimation type={period} />
                        )}
                    </View>
                </View>

                {/* Content Overlay (Children) */}
                <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]}>
                    {children}
                </View>
            </ImageBackground>
        </View>
    );
}
