/* File : home.tsx
 * Description : home screen
 * Author URI : https://evoqins.com
 * Integrations : @react-navigation/stack,@react-navigation/native,react-native-linear-gradient,react-native-encrypted-storage
 * Version : v1.1
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Touchable,
  StyleSheet,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';

// manual import
import { Styles, COLORS, CONSTANTS } from '../../../Theme';
import { myEdges } from '../../../Helper/type-models';
import { Icon } from '../../../Navigator/router';
import { Logo } from '../../Components/Cards';
import Images from '../../../Assets/Images';
import LineAreaChart from '../../Components/Charts/line-chart';
import { scaleWidth } from '../../../Helper/responsive';
import { StorageHelper } from '../../../Helper/storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CarouselCS } from '../../Components/Carousel';
import DynamicBackground from './Components/DynamicBackground';

type RootStackParamList = {
  list: undefined;
  affirmation: undefined;
  wishlist: undefined;
  // allowing others to avoid errors for now
  [key: string]: undefined;
};

type NavigationType = StackNavigationProp<RootStackParamList>;

// Brain Storm Quotes Collection
const BRAIN_STORM_QUOTES = [
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "Everything is energy and that’s all there is to it.", author: "Albert Einstein" },
  { text: "Thoughts become things. If you see it in your mind, you will hold it in your hand.", author: "Bob Proctor" },
  { text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", author: "Rumi" },
  { text: "Ask for what you want and be prepared to get it.", author: "Maya Angelou" },
  { text: "You are the creator of your own reality.", author: "Abraham Hicks" },
  { text: "Imagination is everything. It is the preview of life's coming attractions.", author: "Albert Einstein" },
  { text: "Whatever the mind can conceive and believe, it can achieve.", author: "Napoleon Hill" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
  { text: "To bring anything into your life, imagine that it’s already there.", author: "Richard Bach" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "Beliefs are choices. No one has authority over what you believe.", author: "Byron Katie" },
  { text: "Act as if what you intend to manifest is already a reality.", author: "Wayne Dyer" },
  { text: "You don't attract what you want. You attract what you are.", author: "Wayne Dyer" },
  { text: "Energy flows where attention goes.", author: "Tony Robbins" },
  { text: "The moment you surrender to the universe, the universe surrenders to you.", author: "Universe" },
  { text: "Trust the timing of your life.", author: "Universe" },
  { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
  { text: "What you think, you become. What you feel, you attract. What you imagine, you create.", author: "Buddha" },
];

const { width } = Dimensions.get('window');

// --- Design System for Dashboard ---
const DASH_PALETTES = [
  ['#00897B', '#4DB6AC', '#B2DFDB'], // Teal
  ['#F57C00', '#FFB74D', '#FFE0B2'], // Tangerine
  ['#5E35B1', '#9575CD', '#D1C4E9'], // Lavender
  ['#1E88E5', '#64B5F6', '#BBDEFB'], // Misty Blue
  ['#8E24AA', '#BA68C8', '#E1BEE7'], // Cosmic Purple
];

const DASH_ICONS = ['moon', 'sun', 'star', 'heart', 'cloud']; // Fallback safe icons

// Feature Configuration
const FEATURES = [
  { id: 'affirmation', title: 'Affirmations', route: 'affirmation', icon: 'moon-stars1' },
  { id: 'wishlist', title: 'Wishlist', route: 'wishlist', icon: 'ai-chat' },
  { id: 'journal', title: 'Journal', route: 'journal-list', icon: 'report' },
  { id: 'money', title: 'Money Tracker', route: 'money-tracker', icon: 'daily-sip' },
  // { id: 'meditation', title: 'Meditation', route: 'meditation-landing' },
  { id: 'planner', title: 'Planner', route: 'daily-planner', icon: 'target-arrow' },
  // { id: 'sleep', title: 'Sleep', route: 'sleep-landing' },
  { id: 'headtail', title: 'Head & Tail', route: 'toss-coin', icon: 'flash' },
  { id: 'visualize', title: 'Visualize', route: 'visualization', icon: 'colored-mf' },
];

// --- Animated Icon Stack Component ---
const AnimatedIconStack = ({
  icon,
  palette,
  delay = 0
}: {
  icon: string,
  palette: string[],
  delay?: number
}) => {
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 3000 + delay, // Randomize duration slightly via delay
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3500 + delay,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 4000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
      {/* Secondary Floating Icon */}
      <Animated.View style={{
        position: 'absolute',
        opacity: 0.4,
        transform: [
          { translateY: Animated.multiply(floatAnim, 0.5) },
          { translateX: 10 },
          { scale: 0.6 }
        ]
      }}>
        <Icon name={icon} size={44} color={palette[1]} />
      </Animated.View>

      {/* Main Icon */}
      <Animated.View style={{
        transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
        shadowColor: palette[0],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10
      }}>
        <Icon name={icon} size={32} color={palette[0]} />
      </Animated.View>
    </View>
  );
};

export default function Home(): React.JSX.Element {
  // navigation declaration
  const navigation = useNavigation<NavigationType>();
  const isFocused = useIsFocused();
  const [greeting, setGreeting] = useState('Good evening!');

  // Brain Storm State
  const [brainStormQuote] = useState(() => BRAIN_STORM_QUOTES[Math.floor(Math.random() * BRAIN_STORM_QUOTES.length)]);

  // Memoize random visuals so they don't flicker on re-renders, but refresh on mount
  const featureVisuals = React.useMemo(() => {
    return FEATURES.map((f, i) => ({
      ...f,
      palette: DASH_PALETTES[Math.floor(Math.random() * DASH_PALETTES.length)],
      // icon: DASH_ICONS[Math.floor(Math.random() * DASH_ICONS.length)],
      delay: i * 150
    }));
  }, []); // calculated once per mount

  // Wishlist State
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [latestGoal, setLatestGoal] = useState<string>('Create your first goal');

  React.useEffect(() => {
    if (isFocused) {
      loadWishlistData();
    }
  }, [isFocused]);

  const loadWishlistData = async () => {
    const items = await StorageHelper.getWishlist();
    const completed = items.filter(i => i.status === 'completed');
    const inProgress = items.filter(i => i.status === 'in_progress');

    setCompletedCount(completed.length);
    setInProgressCount(inProgress.length);

    if (inProgress.length > 0) {
      // Sort by creation time descending (newest first) or just take the last one? 
      // Typically new items are appended, so last item is newest.
      // Or if 'createdAt' is available, sort. Assuming natural order for now logic or simple reverse.
      // Let's sort by createdAt desc if available, assuming default sort is order of addition.
      const sorted = [...inProgress].sort((a, b) => b.createdAt - a.createdAt);
      setLatestGoal(sorted[0].title);
    } else {
      setLatestGoal('No active goals');
    }
  };

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good morning!');
    else if (hour >= 12 && hour < 17) setGreeting('Good afternoon!');
    else if (hour >= 17 && hour < 21) setGreeting('Good evening!');
    else setGreeting('Good night!');
  }, []);

  const formatDate = (date: Date | string | number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <SafeAreaView style={[Styles.flexOne, Styles.backgroundColorPureWhite]} edges={[]}>
      {/* status bar */}
      <StatusBar barStyle={'light-content'} translucent backgroundColor={'transparent'} />

      <ScrollView
        style={[Styles.flexGrowOne]}
        keyboardShouldPersistTaps={'always'}
        bounces={false}
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'}
      >
        <View style={[Styles.flexOne]}>

          {/* Dynamic Header with Logo & Date */}
          <DynamicBackground>
            <View style={[Styles.center, Styles.paddingTop20]}>
              <Logo />
              {formatDate(new Date()) && (
                <View style={[Styles.row, Styles.marginLeft6]}>
                  <Text style={[Styles.fontSize10, Styles.textAlignCenter, Styles.marginTop8, { color: COLORS.CHARCOL }]}>
                    {formatDate(new Date())}
                  </Text>
                </View>
              )}
            </View>
          </DynamicBackground>

          <View style={[Styles.marginTop16, Styles.paddingHorizontal16, { marginTop: -150 }]}>

            {/* Greetings - RESTORED */}
            <View style={[Styles.marginBottom16]}>
              <View style={[Styles.row]}>
                <Icon name={'ai-chat'}
                  size={scaleWidth(20)}
                  color={COLORS.CHARCOL} />
                <Text style={[Styles.rubicMedium, Styles.fontSize8, { color: COLORS.CHARCOL }]}>
                  {' '}{greeting}  <Text style={[Styles.RubicBold, Styles.fontSize10, { color: COLORS.CHARCOL }]}>Buddy </Text>
                  {'\n'} Here's your daily dose of calm.
                </Text>
              </View>
            </View>


            {/* Mini Vision Board Canvas - Strict Match to Board.tsx */}
            <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => navigation.navigate('board' as never)}
                style={localStyles.boardContainer}
              >
                {/* Board Background (Frame) */}
                <View style={localStyles.boardBackground} />

                {/* Faded Center Year */}
                <View style={{ position: 'absolute', opacity: 0.06 }}>
                  <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 120, color: COLORS.CHARCOL }}>
                    {new Date().getFullYear()}
                  </Text>
                </View>

                {/* Faded Top Label */}
                <View style={{ position: 'absolute', top: 20, alignSelf: 'center', opacity: 0.2 }}>
                  <Text style={[Styles.rubicMedium, { fontSize: 12, color: COLORS.CHARCOL, textTransform: 'uppercase', letterSpacing: 2 }]}>
                    Vision Board
                  </Text>
                </View>

                <View style={{ position: 'absolute', top: 50, alignSelf: 'center', opacity: 0.2 }}>
                  <Text style={[Styles.rubicRegualr, { textAlign: 'center', fontSize: 12, color: COLORS.CHARCOL, fontStyle: 'italic', lineHeight: 16 }]}>
                    {"The future belongs to those \nwho believe in the beauty \nof their dreams."}
                  </Text>
                </View>

                {/* 1. Completed Pin Card (Top Left) */}
                <View style={[localStyles.pinCard, { transform: [{ rotate: '-3deg' }], top: 30, left: 15, width: 100, height: 120 }]}>
                  <View style={localStyles.pinHead} />

                  {/* Image Area - Placeholder for Count */}
                  <View style={[localStyles.cardImageContainer, { backgroundColor: '#E0F2F1' }]}>
                    <Text style={[Styles.rubicMedium, { fontSize: 28, color: '#00695C' }]}>
                      {completedCount < 10 ? `0${completedCount}` : completedCount}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text style={[Styles.rubicMedium, { fontSize: 10, color: COLORS.CHARCOL, textAlign: 'center', marginTop: 4 }]}>
                    Completed
                  </Text>
                </View>

                {/* 2. In Progress Pin Card (Middle Right) */}
                <View style={[localStyles.pinCard, { transform: [{ rotate: '2.5deg' }], top: 50, right: 15, width: 100, height: 120 }]}>
                  <View style={localStyles.pinHead} />

                  {/* Image Area */}
                  <View style={[localStyles.cardImageContainer, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={[Styles.rubicMedium, { fontSize: 28, color: '#EF6C00' }]}>
                      {inProgressCount < 10 ? `0${inProgressCount}` : inProgressCount}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text style={[Styles.rubicMedium, { fontSize: 10, color: COLORS.CHARCOL, textAlign: 'center', marginTop: 4 }]}>
                    In Progress
                  </Text>
                </View>

                {/* 3. Current Focus Pin Card (Bottom Center) */}
                <View style={[localStyles.pinCard, { transform: [{ rotate: '-1.5deg' }], bottom: 25, alignSelf: 'center', width: 200, height: 130, paddingBottom: 10 }]}>
                  <View style={localStyles.pinHead} />

                  {/* Content Area - Bigger for text */}
                  <View style={{ flex: 1, justifyContent: 'center', width: '100%', alignItems: 'center', paddingHorizontal: 8 }}>
                    {(latestGoal !== 'No active goals' && latestGoal !== 'Create your first goal') ? (
                      <>
                        <View style={{ marginBottom: 6, flexDirection: 'row', alignItems: 'center', opacity: 0.6 }}>
                          <Icon name="star" size={12} color={COLORS.CHARCOL} />
                          <Text style={[Styles.rubicRegualr, { fontSize: 10, color: COLORS.CHARCOL, marginLeft: 4, textTransform: 'uppercase' }]}>
                            Current Focus
                          </Text>
                        </View>
                        <Text numberOfLines={3} style={{ fontFamily: 'Rubik-Regular', fontSize: 16, color: '#2C2C2C', textAlign: 'center', lineHeight: 22 }}>
                          {latestGoal}
                        </Text>
                      </>
                    ) : (
                      <Text style={{ fontFamily: 'Rubik-Italic', fontSize: 14, color: '#90A4AE', textAlign: 'center', lineHeight: 20 }}>
                        "What you hold in mind, begins to shape your world."
                      </Text>
                    )}
                  </View>
                </View>

              </TouchableOpacity>
            </View>
          </View>

          {/* Brain Storm Section */}
          <View style={[Styles.padding16, { marginTop: 8, marginBottom: 8 }]}>
            <Text style={[Styles.rubicMedium, { fontSize: 10, color: COLORS.CHARCOL, opacity: 0.4, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }]}>
              Brain Storm
            </Text>

            <Text style={[Styles.rubicRegualr, { fontSize: 18, color: COLORS.SLATE, lineHeight: 28, textAlign: 'left' }]}>
              "{brainStormQuote.text}"
            </Text>

            <View style={[Styles.row, Styles.justifyFlexEnd, { marginTop: 12 }]}>
              <Text style={[Styles.rubicRegualr, { fontSize: 12, color: COLORS.CHARCOL, opacity: 0.5, fontStyle: 'italic' }]}>
                — {brainStormQuote.author || "Universe"}
              </Text>
            </View>
          </View>
          
          <View style={[Styles.paddingHorizontal24]}>
              <Text style={[Styles.rubicMedium, { fontSize: 14, color: '#333' }]}>
                  Explore Paths
              </Text>
          </View>

          {/* Manifestation Dashboard Grid */}
          <View style={[Styles.padding16, { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 50 }]}>
            {featureVisuals.map((item, index) => {
              // Staggered height logic for organic feel - simpler here: even/odd margin top
              const isEven = index % 2 === 0;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.96}
                  onPress={() => navigation.navigate(item.route as never)}
                  style={{
                    width: index == 6 ? '100%' : '48%',
                    backgroundColor: '#FFF',
                    borderRadius: 20,
                    padding: 16,
                    marginBottom: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 90,
                    marginTop: isEven ? 0 : 0, // Organic stagger
                    // Glass/Soft Feel
                    shadowColor: item.palette[1],
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 16,
                    elevation: 4,
                    borderWidth: 6,
                    borderColor: 'rgba(255,255,255,0.8)'
                  }}
                >
                  {/* Background Gradient hint using absolute view if needed, or just white for cleanliness with colored shadows */}
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: item.palette[2], opacity: 0.3, borderRadius: 20 }]} />

                  <AnimatedIconStack icon={item.icon} palette={item.palette} delay={item.delay} />

                  <Text style={[Styles.rubicMedium, { fontSize: 13, color: COLORS.CHARCOL, textAlign: 'center', letterSpacing: 0.5 }]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
           <View style={[Styles.paddingHorizontal24, Styles.marginBottom16]}>
              <Text style={[Styles.rubicMedium, { fontSize: 14, color: '#333' }]}>
                  Dream It. Live It.
              </Text>
          </View>
          <CarouselCS />

          <View style={[Styles.padding16, { paddingBottom: 100, marginTop: 30, alignItems: 'center', opacity: 0.6 }]}>
            <View style={{ width: 40, height: 2, backgroundColor: COLORS.CHARCOL, opacity: 0.1, marginBottom: 16 }} />

            <Text style={[Styles.rubicMedium, { fontSize: 10, color: COLORS.CHARCOL, textTransform: 'uppercase', letterSpacing: 3 }]}>
              SyncCalm Studios
            </Text>

            <Text style={[Styles.rubicRegualr, { fontSize: 12, color: COLORS.CHARCOL, opacity: 0.5, marginTop: 4, fontStyle: 'italic' }]}>
              Crafted for your inner peace
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}

const localStyles = StyleSheet.create({
  boardContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F7F5F0',
    borderRadius: 4,
    borderWidth: 8,
    borderColor: '#FFF',
    shadowColor: '#8D6E63',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  pinCard: {
    position: 'absolute',
    backgroundColor: '#FFF',
    padding: 6, // White border feel
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pinHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E57373', // Red pin
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
