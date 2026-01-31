/*
 *   File :step-up-sip.jsx
 *   Author URI : https://evoqins.com
 *   Description : sip step up modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CONSTANTS, Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { PrimaryButton } from '../Buttons';

// props
type SipStepUpModalProps = {
  show: boolean;
  step_up_percent: object;
  step_up_month: object;
  onClose?: () => void;
  onPress: (month: number, percent: number) => void;
};
const SipStepUp: React.FC<SipStepUpModalProps> = (props: SipStepUpModalProps) => {
  const [stepUpPercent, setStepUpPercent] = useState<number>(3);
  const [stepUpMonth, setStepUpMonth] = useState<number>(3);

  // handle onClose
  const _onClose = () => {
    props.onClose?.();
  };

  //handle step up percentage
  const _handleStepUpPercentage = (id: number) => {
    setStepUpPercent(id);
  };

  //handle step up month
  const _handleStepUpMonth = (id: number) => {
    setStepUpMonth(id);
  };

  //Function to handle the primary button
  const _handlePrimaryButton = () => {
    console.log(':stepUpMonth', stepUpMonth);
    console.log('stepUpPercent:', stepUpPercent);
    props.onPress(stepUpMonth, stepUpPercent);
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent
      visible={props.show}
      onRequestClose={_onClose}
    >
      <View style={[Styles.positionAbsolute]}>
        <BlurView
          style={[Styles.positionAbsolute]}
          blurType="light" // "light" | "dark" | "xlight"
          blurAmount={1} // 👈 make this higher (10–25) for visible blur
          reducedTransparencyFallbackColor="white"
        />
      </View>
      <View style={[Styles.flexOne, Styles.alignItemsCenter, Styles.justifyFlexEnd]}>
        <View
          style={[
            Styles.borderWidth2,
            Styles.borderColorWhiteOpacity10,
            Styles.fullWidth,
            Styles.borderTopLeftRadius32,
            Styles.borderTopRightRadius32,
            Styles.backgroundColorPureWhite,
          ]}
        >
          <View style={[Styles.padding16]}>
            <View
              style={[
                Styles.alignSelfCenter,
                Styles.height1,
                Styles.backgroundColorLightSilver,
                Styles.Width72,
                Styles.marginBottom16,
              ]}
            />
            <Text
              style={[
                Styles.fontSize14,
                Styles.lineHeight20,
                Styles.rubikMedium,
                Styles.colorCynder,
              ]}
            >
              Add step-up details
            </Text>

            <View style={[Styles.paddingTop16]}>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight16,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                  Styles.textAlignCenter,
                ]}
              >
                Add Step-up*
              </Text>

              <View style={[Styles.paddingTop16]}>
                <Text
                  style={[
                    Styles.fontSize24,
                    Styles.lineHeight32,
                    Styles.rubikMedium,
                    Styles.colorCynder,
                    Styles.textAlignCenter,
                  ]}
                >
                  10%
                </Text>
              </View>
            </View>

            <View
              style={[
                Styles.alignSelfCenter,
                Styles.height1,
                Styles.backgroundColorLightSilver,
                Styles.width156,
                Styles.marginTop8,
                Styles.marginBottom16,
              ]}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[Styles.rowCenter]}
            >
              <View style={[Styles.rowCenter]}>
                {props.step_up_percent.map((item, index) => {
                  const is_selected = item.id == stepUpPercent;

                  return (
                    <TouchableOpacity
                      activeOpacity={CONSTANTS.activeOpacity}
                      key={index}
                      onPress={() => _handleStepUpPercentage(item.id)}
                      style={[
                        Styles.borderWidth2,
                        Styles.paddingHorizontal26,
                        Styles.paddingVertical8,
                        Styles.borderColorLightishSilver,
                        Styles.borderRadius16,
                        Styles.marginLeft12,
                        // index != FUNDS_CATEGORY.length - 1 && [Styles.marginRight8],
                        is_selected
                          ? [
                              Styles.borderColorDarkPrimary,
                              Styles.backgroundColorLightLavendar_OPACITY30,
                            ]
                          : [Styles.borderColorLightishSilver],
                      ]}
                    >
                      <Text
                        style={[
                          Styles.fontSize14,
                          Styles.lineHeight20,
                          Styles.rubikRegular,
                          Styles.colorCynder,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={[Styles.paddingTop20, Styles.rowCenter, Styles.spaceBetween]}>
              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight16,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                Add Every
              </Text>
              <View style={[Styles.rowCenter, Styles.width190]}>
                {props.step_up_month.map((item, index) => {
                  const is_selected = item.id == stepUpMonth;

                  return (
                    <TouchableOpacity
                      activeOpacity={CONSTANTS.activeOpacity}
                      key={index}
                      onPress={() => _handleStepUpMonth(item.id)}
                      style={[
                        Styles.borderWidth2,
                        Styles.paddingHorizontal18,
                        Styles.paddingVertical4,
                        Styles.borderColorLightishSilver,
                        Styles.borderRadius16,
                        Styles.marginLeft12,
                        // index != FUNDS_CATEGORY.length - 1 && [Styles.marginRight8],
                        is_selected
                          ? [
                              Styles.borderColorDarkPrimary,
                              Styles.backgroundColorLightLavendar_OPACITY30,
                            ]
                          : [Styles.borderColorLightishSilver],
                      ]}
                    >
                      <Text
                        style={[
                          Styles.fontSize14,
                          Styles.lineHeight20,
                          Styles.rubikRegular,
                          Styles.colorCynder,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          <View style={[Styles.marginTop16, Styles.paddingHorizontal16, Styles.paddingBottom24]}>
            <PrimaryButton
              disabled={false}
              onPress={() => _handlePrimaryButton()}
              label={'Add Step-up'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SipStepUp;
