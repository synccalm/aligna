import React, { useContext, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolate, Extrapolate, withTiming } from 'react-native-reanimated';

// manual imports
import { Styles, COLORS } from '../../../Theme';
import { scaleWidth } from '../../../Helper/responsive';

import { AuthContext } from '../../../Navigator/router';
import Images from '../../../Assets/Images';
import AnimatedBackground from './animated-background';
import { Icon } from '../../../Navigator/router';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const ONBOARD_DATA = [
  {
    id: 1,
    title: 'Discover Your Energy',
    desc: 'Think in terms of energy, frequency and vibration to unlock the universe.',
    author: '- Nikola Tesla',
    icon: 'energy' // Placeholder or use an image
  },
  {
    id: 2,
    title: 'Belief Shapes Reality',
    desc: 'Whatever the mind can conceive and believe, it can achieve.',
    author: '- Napoleon Hill',
    icon: 'mind'
  },
  {
    id: 3,
    title: 'Manifest Your Thoughts',
    desc: 'If you see it in your mind, you will hold it in your hand.',
    author: '- Bob Proctor',
    icon: 'hand'
  },
  {
    id: 4,
    title: 'Immerse Yourself',
    desc: 'Your thoughts are the primary cause of everything.',
    author: '- Rhonda Byrne',
    icon: 'universe'
  },
];

const PaginationDot = ({ isActive }: { isActive: boolean }) => {
  const width = useSharedValue(8);
  const opacity = useSharedValue(0.5);

  React.useEffect(() => {
    width.value = withSpring(isActive ? 24 : 8, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(isActive ? 1 : 0.5, { duration: 300 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      opacity: opacity.value,
      backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
        },
        animatedStyle,
      ]}
    />
  );
};

const Introduction: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const authContext = useContext(AuthContext);
  const finishIntro = authContext?.finishIntro;

  function _skip() {
    if (finishIntro) {
      finishIntro();
    }
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={localStyles.cardContainer}>
        <View style={localStyles.iconContainer}>
          {/* Placeholder for icon/image, using a simple view or generic icon for now */}
          <Text style={{ fontSize: 40 }}>✨</Text>
        </View>
        <Text style={localStyles.title}>{item.title}</Text>
        <Text style={localStyles.description}>{item.desc}</Text>
        <Text style={localStyles.author}>{item.author}</Text>
      </View>
    );
  };

  return (
    <View style={Styles.flexOne}>
      <AnimatedBackground />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <SafeAreaView style={Styles.flexOne} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Carousel
            loop
            width={windowWidth}
            height={windowHeight * 0.6}
            autoPlay={true}
            data={ONBOARD_DATA}
            scrollAnimationDuration={2000}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={renderItem}
            mode="parallax" // Use parallax for premium feel
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
          />
        </View>

        {/* Indicators */}
        <View style={localStyles.indicatorContainer}>
          {ONBOARD_DATA.map((_, index) => (
            <PaginationDot key={index} isActive={currentIndex === index} />
          ))}
        </View>

        {/* Footer Button */}
        <View style={localStyles.footer}>
          <TouchableOpacity activeOpacity={0.8} onPress={_skip} style={localStyles.button}>
            <Text style={localStyles.buttonText}>Start Your Journey</Text>
            <Icon name="arrow-right" size={20} color={COLORS.CHARCOL} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glassmorphism-ish
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    marginVertical: 16, // Add vertical margin for shadow space
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontFamily: 'Rubik-Medium',
    fontSize: 24,
    color: '#1D3639',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5
  },
  description: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: '#546E7A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24
  },
  author: {
    fontFamily: 'Rubik-Italic',
    fontSize: 14,
    color: '#78909C',
    textAlign: 'center'
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  buttonText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#1D3639'
  }
});

export default Introduction;
