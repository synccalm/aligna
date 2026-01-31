import React, { useContext, useState } from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// manual imports
import { Styles } from '../../../Theme';
import { BlurView } from '@react-native-community/blur';
import { scaleWidth } from '../../../Helper/responsive';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { Statusbar } from '../../Components/StatusBar';
import { AuthContext } from '../../../Navigator/router';
import { PrimaryButton } from '../../Components/Buttons';
import Images from '../../../Assets/Images';

const ONBOARD_DATA = [
  {
    id: 1,
    title:
      'If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.',
    image: Images.intro1,
    desc: '- Nikola Tesla',
  },
  {
    id: 2,
    title: 'Whatever the mind can conceive and believe, it can achieve.',
    image: Images.intro2,
    desc: '- Napoleon Hill',
  },
  {
    id: 3,
    title: 'Thoughts become things. If you see it in your mind, you will hold it in your hand.',
    image: Images.intro3,
    desc: '- Bob Proctor',
  },
  {
    id: 4,
    title: 'Your thoughts are the primary cause of everything.',
    image: Images.intro4,
    desc: '- Rhonda Byrne',
  },
];

const Introduction: React.FC = () => {
  const [UIIndex, setUIIndex] = useState<number>(0);

  const { signOut } = useContext<AuthContextProps>(AuthContext);

  function _skip() {
    signOut();
  }

  return (
    <SafeAreaView style={Styles.flexGrowOne} edges={['top']}>
      <ImageBackground
        source={require('../../../Assets/img/bg1.jpg')}
        style={[Styles.fullWidth, Styles.fullHeight]}
      >
        <Statusbar type={1} />
        <View style={[Styles.center, Styles.fullWidth, Styles.marginTop40]}>
          <Text>Sync Calm</Text>
        </View>

        <View
          style={[Styles.spaceBetween, Styles.flexOne, Styles.marginTop20, Styles.marginBottom12]}
        >
          <View style={[{ width: scaleWidth(360), height: scaleWidth(530) }]}>
            <SwiperFlatList
              autoplay={true}
              autoplayLoop={true}
              autoplayDelay={3}
              index={UIIndex}
              data={ONBOARD_DATA}
              scrollEnabled={true}
              overScrollMode={'never'}
              bounces={false}
              style={[Styles.flexOne]}
              onChangeIndex={({ index }) => setUIIndex(index)}
              renderItem={({ item }) => (
                <View style={[{ width: scaleWidth(360) }, Styles.flexOne, Styles.alignItemsCenter]}>
                  <View
                    style={[
                      Styles.width312,
                      Styles.borderRadius22,
                      Styles.height208,
                      {
                        overflow: 'hidden',
                      },
                    ]}
                  >
                    <BlurView
                      style={[
                        Styles.width312,
                        Styles.positionAbsolute,
                        Styles.height208,
                        {
                          overflow: 'hidden',
                        },
                      ]}
                      blurType="light"
                      blurAmount={0.8}
                    >
                      <View style={[Styles.padding16]}>
                        <Text
                          style={[
                            Styles.rubicMedium,
                            Styles.colorCynder,
                            { width: scaleWidth(260) },
                            Styles.textAlignCenter,
                            Styles.lineHeight20,
                            Styles.fontSize18,
                          ]}
                        >
                          {item.title}
                        </Text>

                        <View style={[Styles.marginTop10]}>
                          <Text
                            style={[
                              Styles.rubicRegualr,
                              { width: scaleWidth(258), color: '#666666' },
                              Styles.textAlignCenter,
                              Styles.fontSize14,
                              Styles.lineHeight24,
                            ]}
                          >
                            {item.desc}
                          </Text>
                        </View>
                      </View>
                    </BlurView>
                  </View>
                </View>
              )}
            />

            <View style={[Styles.row, Styles.center, Styles.marginTop32]}>
              {[1, 2, 3, 4].map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      {
                        width: UIIndex == index ? scaleWidth(8) : scaleWidth(4),
                        height: scaleWidth(4),
                        borderRadius: 8,
                        backgroundColor: UIIndex == index ? '#001C80' : '#D3CFE2',
                        marginRight: 3,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>

          <View style={[Styles.padding16]}>
            {/* <View style={[Styles.marginTop16, Styles.marginBottom20]}>
                <PrimaryButton type={2} onPress={() => _skip()} label={'Get Started'} />
              </View> */}
            <View style={[Styles.center, Styles.marginBottom12]}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => _skip()}>
                <Text style={[Styles.RubicSemiBold, Styles.fontSize14, { color: '#001C80' }]}>
                  Start your life Now!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Introduction;
