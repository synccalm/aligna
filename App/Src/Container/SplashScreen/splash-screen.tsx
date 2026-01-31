/* File : splash-screen.tsx
 * Description : Animated Splash Screen for Aligna
 * Author : SyncCalm
 * Version : v2.2
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, Animated, Easing, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import MainApp from '../../../Navigator/router'; // Import the main App navigation

const { width, height } = Dimensions.get('window');

// Static Theme as requested (Morning)
const THEME = {
  vals: ['rgba(238, 242, 245, 0)', 'rgba(29, 54, 57, 0.9)'],
  text: COLORS.CHARCOL,
  icon: COLORS.TANGERING
};

export default function SplashScreen(): React.JSX.Element {

  // Animation Values
  const scaleAnim = useRef(new Animated.Value(0)).current;   // Logo Scale
  const opacityAnim = useRef(new Animated.Value(0)).current; // Text Opacity
  const slideAnim = useRef(new Animated.Value(50)).current;  // Text Slide Up
  const pulseAnim = useRef(new Animated.Value(1)).current;   // Icon Pulse

  const [isSplashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    // 1. Start Animations
    startAnimations();

    // 2. Finish Splash after delay -> Render MainApp
    const timer = setTimeout(() => {
      setSplashFinished(true);
    }, 3500); // 3.5s total splash time

    return () => clearTimeout(timer);
  }, []);

  const startAnimations = () => {
    // Sequence: Logo Pop -> Text Slide/Fade -> Continuous Pulse
    Animated.sequence([
      // 1. Logo Pop (Elastic)
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
      // 2. Text Reveal
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      // 3. Continuous Pulse after entrance
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    });
  };

  // If splash is finished, render the actual functionalities (Router)
  // Note: Removed '&& false' to ensure app loads. Add back if you want to stay on splash.
  if (isSplashFinished) {
    return <MainApp />;
  }

  return (
    <View style={Styles.flexOne}>
      <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'} />

      <ImageBackground
        //source={require("../../../Assets/img/dy-bg.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={THEME.vals}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
        />

        <View style={[Styles.flexOne, Styles.center]}>

          {/* Logo Container */}
          <Animated.View style={{
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim }
            ]
          }}>
            <View style={[styles.logoCircle, { shadowColor: THEME.icon }]}>
              <Icon name="feather" size={scaleWidth(60)} color={COLORS.CHARCOL} />
            </View>
          </Animated.View>

          {/* Text Container */}
          <Animated.View style={{
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
            marginTop: 40,
            alignItems: 'center'
          }}>
            {/* App Name */}
            <Text style={[Styles.RubicBold, { fontSize: 42, color: THEME.text, letterSpacing: 2 }]}>
              Aligna
            </Text>

            {/* Separator / Decoration */}
            <View style={{ width: 40, height: 4, backgroundColor: THEME.icon, marginTop: 16, borderRadius: 2 }} />

            {/* Slogan */}
            <Text style={[Styles.rubicMedium, {
              fontSize: 14,
              color: THEME.text,
              marginTop: 24,
              opacity: 1,
              textAlign: 'center',
              lineHeight: 22
            }]}>
              Align your mind, energy {'\n'} and intentions.
            </Text>
          </Animated.View>

        </View>

        {/* Footer / Copyright */}
        <Animated.View style={{ position: 'absolute', bottom: 50, opacity: opacityAnim, width: '100%', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 10, letterSpacing: 1 }}>
            © SyncCalm
          </Text>
        </Animated.View>
        <FallingRain />
      </ImageBackground>
    </View>
  );
}

const FallingIcon = ({ delay, duration, startX, size, color }: { delay: number; duration: number; startX: number; size: number, color: string }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current; // Start invisible

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 50,
            duration: duration,
            delay: delay,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.6, // Fade in
              duration: duration * 0.2,
              delay: delay,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0, // Fade out
              duration: duration * 0.8,
              useNativeDriver: true,
            })
          ])
        ]),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute',
      top: 0,
      left: startX,
      transform: [{ translateY }],
      opacity,
      zIndex: 0
    }}>
      <Icon name="raindrop1" size={size} color={color} />
    </Animated.View>
  );
};

const FallingRain = () => {
  // Generate random drops with Teal/White colors and smaller size
  const drops = Array.from({ length: 20 }).map((_, i) => ({
    key: i, // Ensure unique key
    startX: Math.random() * width,
    delay: Math.random() * 3000,
    duration: 4000 + Math.random() * 2000, // Slower fall
    size: scaleWidth(8 + Math.random() * 8), // Smaller size (8-16)
    color: i % 2 === 0 ? COLORS.TEAL : 'white' // Alternate colors
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents='none'>
      {drops.map((drop) => <FallingIcon key={drop.key} {...drop} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  logoCircle: {
    width: scaleWidth(120),
    height: scaleWidth(120),
    borderRadius: scaleWidth(60),
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  }
});
