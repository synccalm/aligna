/*
 *   File :why-not-aug.jsx
 *   Author URI : https://evoqins.com
 *   Description : why-not-aug modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React from 'react';
import { View, Text, Modal } from 'react-native';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { PrimaryButton } from '../Buttons';
import Icon from '../../../Assets/icon';

// props
type WhyNotAugProps = {
  show: boolean;
  onClose?: () => void;
};
const WhyNotAug: React.FC<WhyNotAugProps> = (props: WhyNotAugProps) => {
  // handle onClose
  const _onClose = () => {
    props.onClose?.();
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
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
      </View>
      <View style={[Styles.flexOne, Styles.alignItemsCenter, Styles.justifyFlexEnd]}>
        <View
          style={[
            Styles.borderWidth2,
            Styles.borderColorWhite,
            Styles.fullWidth,
            Styles.borderTopLeftRadius32,
            Styles.borderTopRightRadius32,
            Styles.backgroundColorWhiteOpacity70,
          ]}
        >
          <View style={[Styles.padding16]}>
            <View
              style={[
                Styles.alignSelfCenter,
                Styles.height1,
                Styles.backgroundColorWhiteOpacity10,
                Styles.Width72,
                Styles.marginBottom8,
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
              SIP date details
            </Text>

            <View style={[Styles.rowCenter]}>
              <View
                style={[
                  Styles.heightWidth40,
                  Styles.borderRadius16,
                  Styles.borderWidth2,
                  Styles.alignItemsCenter,
                  Styles.center,
                  Styles.borderColorWhite,
                ]}
              >
                <Icon name="calendar" size={CONSTANTS.Width24} color={COLORS.BLACK} />
              </View>

              <View style={[Styles.marginLeft8]}>
                <Text
                  style={[
                    Styles.fontSize12,
                    Styles.lineHeight20,
                    Styles.rubikMedium,
                    Styles.colorCynder,
                  ]}
                >
                  1st Instalment today
                </Text>
                <Text
                  style={[
                    Styles.fontSize12,
                    Styles.lineHeight18,
                    Styles.rubikRegular,
                    Styles.colorDimGray,
                  ]}
                >
                  Today
                </Text>
              </View>
            </View>

            <View
              style={[
                Styles.height32,
                Styles.width2,
                Styles.marginVertical8,
                Styles.backgroundColorPureWhite,
                Styles.marginLeft18,
              ]}
            />
            <View style={[Styles.rowCenter]}>
              <View
                style={[
                  Styles.heightWidth40,
                  Styles.borderRadius16,
                  Styles.borderWidth2,
                  Styles.alignItemsCenter,
                  Styles.center,
                  Styles.borderColorWhite,
                ]}
              >
                <Icon name="calendar" size={CONSTANTS.Width24} color={COLORS.BLACK} />
              </View>

              <View style={[Styles.marginLeft8]}>
                <Text
                  style={[
                    Styles.fontSize12,
                    Styles.lineHeight20,
                    Styles.rubikMedium,
                    Styles.colorCynder,
                  ]}
                >
                  Next SIP
                </Text>
                <Text
                  style={[
                    Styles.fontSize12,
                    Styles.lineHeight18,
                    Styles.rubikRegular,
                    Styles.colorDimGray,
                  ]}
                >
                  1 Sep 2025
                </Text>
              </View>
            </View>

            <View style={[Styles.marginBottom12, Styles.marginTop32]}>
              <PrimaryButton
                disabled={false}
                is_both={false}
                onPress={() => _onClose()}
                label={'Understood'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WhyNotAug;
