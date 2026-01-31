/* File : affirmation.tsx
 * Description : Redesigned Affirmation Screen for Aligna
 * Author : SyncCalm
 * Version : v2.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSharedValue, useDerivedValue, interpolate, Extrapolate, runOnJS } from "react-native-reanimated";
import Animated, { FadeInUp, FadeOutDown, Layout } from 'react-native-reanimated';

// Manual Imports
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { AIQ } from '../../Components/Other';
import { StorageHelper, CustomAffirmation } from '../../../Helper/storage';

const { width } = Dimensions.get('window');

// Navigation Types
type RootStackParamList = {
  list: undefined;
};
type NavigationType = StackNavigationProp<RootStackParamList>;

// Initial Data (Same as before)
const initialAffirmations: any[] = [
  { wealth: ["I attract wealth effortlessly", "Money flows to me freely", "I am worthy of abundance", "Wealth comes to me from many sources", "I am financially empowered", "I create wealth with ease", "Abundance surrounds me", "I deserve financial prosperity", "My income is constantly increasing", "I am aligned with wealth", "I make smart financial decisions", "Money works for me", "I welcome unlimited abundance", "I am open to receiving wealth", "Prosperity is my natural state", "I attract profitable opportunities", "Wealth grows in my life daily", "I am grateful for my abundance", "I manage money wisely", "Financial success is mine"] },
  { health: ["My body is strong and healthy", "I am full of energy", "I nourish my body with love", "My mind and body are in balance", "I feel vibrant and alive", "Every cell in my body is healthy", "I recover quickly and completely", "I honor my body’s needs", "I breathe in health and vitality", "My immune system is strong", "I am physically resilient", "I choose habits that support my health", "My body heals naturally", "I am grateful for my healthy body", "I feel calm and relaxed", "My body grows stronger every day", "I release stress easily", "I sleep deeply and peacefully", "I feel good in my body", "Health flows through me"] },
  { happiness: ["I choose happiness every day", "Joy flows naturally within me", "I am content with my life", "I find happiness in small moments", "I radiate positivity", "I am at peace with myself", "I allow myself to feel joy", "My life is filled with laughter", "I attract joyful experiences", "I deserve to be happy", "I release negativity easily", "Happiness is my natural state", "I appreciate the present moment", "I feel grateful and fulfilled", "I spread happiness to others", "I am emotionally balanced", "I enjoy my journey", "I smile often and freely", "I welcome happiness into my life", "Joy is always available to me"] },
  { success: ["I am successful in all I do", "Success comes naturally to me", "I achieve my goals with confidence", "I am focused and determined", "I turn challenges into opportunities", "I believe in my abilities", "I am driven and disciplined", "Success follows my actions", "I am proud of my achievements", "I take consistent action", "I am capable of great things", "My efforts lead to success", "I learn from every experience", "I attract winning opportunities", "I stay committed to my goals", "I am confident in my path", "I create my own success", "I succeed with integrity", "I trust my journey", "Success is inevitable for me"] },
  { money: ["Money comes to me easily", "I have a healthy relationship with money", "I am financially secure", "Money supports my life goals", "I attract money consistently", "I respect and value money", "I am open to earning more", "Money flows to me in abundance", "I use money wisely", "I always have enough money", "Money brings me freedom", "I am confident with my finances", "I welcome financial growth", "Money is a positive force in my life", "I am grateful for my income", "Money helps me live fully", "I earn money doing meaningful work", "I trust my financial decisions", "Money circulates freely in my life", "I am aligned with financial abundance"] }
];

export default function Affirmation(): React.JSX.Element {
  const navigation = useNavigation<NavigationType>();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  // State
  const [selectedAffirmation, setSelectedAffirmation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<string[]>([]);
  const [question, setQuestion] = useState<string>("What is your affirmation for today?");
  const [aiqData, setAiqData] = useState<string[]>((['Wealth', 'Health', 'Happiness', 'Success', 'Money', 'I want to create my Own']));

  // Custom Flow State
  const [creationStep, setCreationStep] = useState<number>(0);
  const [inputText, setInputText] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [customLines, setCustomLines] = useState<string[]>([]);

  // Custom Affirmations
  const [customAffirmations, setCustomAffirmations] = useState<CustomAffirmation[]>([]);
  const [customAffirmationsMap, setCustomAffirmationsMap] = useState<Record<string, string[]>>({});

  useFocusEffect(useCallback(() => { loadCustomAffirmations(); }, []));

  const loadCustomAffirmations = async () => {
    const customs = await StorageHelper.getCustomAffirmations();
    setCustomAffirmations(customs);
    const map: Record<string, string[]> = {};
    const titles: string[] = [];
    customs.forEach(c => { map[c.title.toLowerCase()] = c.lines; titles.push(c.title); });
    setCustomAffirmationsMap(map);
    setAiqData(['Wealth', 'Health', 'Happiness', 'Success', 'Money', ...titles, 'I want to create my Own']);
  };

  useEffect(() => {
    if (selectedAffirmation === 'I want to create my Own') {
      setQuestion("What is the name of your affirmation?");
      setData([]); setCreationStep(0); setInputText(''); setCustomName(''); setCustomLines([]);
    } else if (selectedAffirmation) {
      setIsLoading(true);
      setTimeout(() => {
        const key = selectedAffirmation.toLowerCase();
        let affirmationData = initialAffirmations.find(item => item[key])?.[key];
        if (!affirmationData && customAffirmationsMap[key]) affirmationData = customAffirmationsMap[key] || [];
        setData(affirmationData || []);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedAffirmation, customAffirmationsMap]);

  const handleFlowSubmit = () => {
    if (!inputText.trim()) return;
    if (creationStep === 0) {
      setCustomName(inputText.trim()); setCreationStep(1); setQuestion("Write your first affirmation line"); setInputText('');
    } else {
      setCustomLines(prev => [...prev, inputText.trim()]); setCreationStep(prev => prev + 1); setQuestion("Write your next affirmation line"); setInputText('');
    }
  };

  const handleSaveAffirmation = async () => {
    if (!customName || customLines.length === 0) return;
    const newAffirmation: CustomAffirmation = { id: Date.now().toString(), title: customName, lines: customLines, createdAt: new Date().toISOString() };
    await StorageHelper.saveCustomAffirmation(newAffirmation);
    await loadCustomAffirmations();
    setSelectedAffirmation(customName);
  };

  const handleDeleteCustomAffirmation = (id: string, title: string) => {
    Alert.alert("Delete Affirmation", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: async () => { await StorageHelper.deleteCustomAffirmation(id); await loadCustomAffirmations(); if (selectedAffirmation === title) setSelectedAffirmation(null); }, style: "destructive" }
    ]);
  };

  // Render Card Item
  const renderCard = ({ item, index }: { item: string, index: number }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Card Content */}
          <View style={styles.textContainer}>
            <Animated.Text
              entering={FadeInUp.delay(200).springify()}
              style={styles.affirmationText}
            >
              {item}
            </Animated.Text>

            {/* Decorative Icon */}
            <View style={[Styles.center, Styles.marginTop24]}>
              <Icon name="colored-mf" size={scaleWidth(24)} color={COLORS.TEAL} style={{ opacity: 0.5 }} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Ambient Background Colors
  const ambientGradient = ['#FDFBF7', '#E0F2F1', '#E8EAF6']; // Warm Beige -> Soft Teal -> Pale Lavender

  return (
    <View style={Styles.flexOne}>
      <StatusBar barStyle={'dark-content'} translucent backgroundColor="transparent" />

      {/* Ambient Gradient Background */}
      <LinearGradient colors={ambientGradient} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <SafeAreaView style={Styles.flexOne} edges={['top']}>

        {/* Header */}
        <View style={[Styles.row, Styles.paddingHorizontal16, Styles.alignItemsCenter, { height: 60 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Icon name="arrow" size={scaleWidth(24)} color={COLORS.CHARCOL} style={{ transform: [{ rotate: '90deg' }] }} />
          </TouchableOpacity>
          {data.length > 0 && (
            <Text style={[Styles.rubicMedium, { fontSize: 18, color: COLORS.CHARCOL, marginLeft: 16 }]}>
              {selectedAffirmation}
            </Text>
          )}
        </View>

        {/* Main Content */}
        <View style={Styles.flexOne}>
          {(data.length === 0) ? (
            // Selection Mode
            <View style={[Styles.flexOne, Styles.paddingHorizontal16]}>
              <Text style={[Styles.rubicRegualr, { fontSize: 28, color: COLORS.CHARCOL, marginTop: 24, marginBottom: 32 }]}>
                {isLoading ? "Curating for you..." : question}
              </Text>

              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.TEAL} style={{ marginTop: 50 }} />
              ) : (
                <View style={{ flex: 1 }}>
                  <AIQ
                    question={""} // Handled above
                    type={selectedAffirmation === 'I want to create my Own' ? 'input' : "text"}
                    isLoading={isLoading}
                    onPress={(value) => setSelectedAffirmation(value)}
                    data={selectedAffirmation === 'I want to create my Own' ? [] : aiqData}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmit={handleFlowSubmit}
                    showSave={selectedAffirmation === 'I want to create my Own' && creationStep > 1 && customLines.length > 0}
                    onSave={handleSaveAffirmation}
                  />

                  {/* Custom List */}
                  {!selectedAffirmation && customAffirmations.length > 0 && (
                    <View style={[Styles.marginTop24]}>
                      <Text style={[Styles.rubicMedium, { fontSize: 14, color: COLORS.SLATE, marginBottom: 12 }]}>YOUR COLLECTION</Text>
                      {customAffirmations.map((item) => (
                        <View key={item.id} style={styles.customItem}>
                          <Text style={[Styles.rubicRegualr, { fontSize: 16, color: COLORS.CHARCOL }]}>{item.title}</Text>
                          <TouchableOpacity onPress={() => handleDeleteCustomAffirmation(item.id, item.title)}>
                            <Icon name="close-circle" size={scaleWidth(20)} color={COLORS.TANGERING} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            // Carousel Mode
            <View style={[Styles.flexOne, Styles.center, { paddingBottom: 50 }]}>
              <Carousel
                ref={ref}
                width={width}
                height={450}
                data={data}
                renderItem={renderCard}
                onProgressChange={progress}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 50,
                  parallaxAdjacentItemScale: 0.8,
                }}
              />

              <Pagination.Custom
                progress={progress}
                data={data}
                dotStyle={{ backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 50, height: 6, width: 6 }}
                activeDotStyle={{ backgroundColor: COLORS.TEAL, borderRadius: 50, width: 20, height: 6 }}
                containerStyle={{ gap: 8, marginTop: 40 }}
                onPress={(index) => ref.current?.scrollTo({ count: index - progress.value, animated: true })}
              />
            </View>
          )}
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    height: 400,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    // Premium Shadow
    shadowColor: "#4E7AC7",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)'
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  affirmationText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 28,
    color: COLORS.CHARCOL,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  customItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  }
});
