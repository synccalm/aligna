/* File : logo.tsx
 * Description : Modern App Header (Brand Identity)
 * Version : v2.0
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';

type HeaderProps = {
  activeOpacity?: number;
};

export default function Logo(props: HeaderProps): React.JSX.Element {
  const navigation = useNavigation();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle entrance animation
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0]
  });

  return (
    <Animated.View style={[localStyles.container, { opacity, transform: [{ translateY }] }]}>

      {/* 1. LEFT: BRAND MARK */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Minimal Symbol - Abstract Dot/Moon */}
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.TEAL, marginRight: 8, opacity: 0.8 }} />

        <Text style={[Styles.rubicMedium, { fontSize: 18, color: COLORS.CHARCOL, letterSpacing: 0.5 }]}>
          Aligna
        </Text>
      </View>

      {/* 2. CENTER: PHILOSOPHY (Optional, Very Subtle) */}
      <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center', pointerEvents: 'none' }}>
        <Text style={[Styles.rubicRegualr, { fontSize: 10, color: COLORS.CHARCOL, opacity: 0.3, letterSpacing: 2, textTransform: 'uppercase' }]}>
          Dream • Align • Become
        </Text>
      </View>

      {/* 3. RIGHT: UTILITY ICONS */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.7} style={localStyles.iconButton}>
          {/* Simple Notification Dot */}
          <View style={localStyles.notifDot} />
          <Icon name="notification" size={20} color={COLORS.CHARCOL} style={{ opacity: 0.7 }} />
        </TouchableOpacity>
      </View>

    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    zIndex: 100
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.03)' // Very subtle touch target backing
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E57373',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#FFF'
  }
});
