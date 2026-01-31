/*
 *   File :why-basket.jsx
 *   Author URI : https://evoqins.com
 *   Description : why-basket modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { PrimaryButton } from '../Buttons';

// props
type WhyBasketProps = {
  show: boolean;
  title?: string;
  content?: string;
  type?: number;
  label?: string;
  onClose?: () => void;
};
const WhyBasket: React.FC<WhyBasketProps> = (props: WhyBasketProps) => {
  // handle onClose
  const _onClose = () => {
    props.onClose?.();
  };

  //Function to handle the primary button
  const _handlePrimaryButton = () => {
    props.onSubmit();
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
            Styles.borderColorWhite,
            Styles.fullWidth,
            Styles.borderTopRightRadius32,
            Styles.borderTopLeftRadius32,
            Styles.backgroundColorPureWhite,
          ]}
        >
          <View style={[Styles.padding16]}>
            <View
              style={[
                Styles.alignSelfCenter,
                Styles.height1,
                Styles.backgroundColorGreyOpacity40,
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
                props.type == 1 && Styles.textAlignCenter,
              ]}
            >
              {props.title}
            </Text>

            <View style={[Styles.paddingTop16, Styles.marginBottom24]}>
              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                  props.type == 1 && Styles.textAlignCenter,
                ]}
              >
                {props.content}
              </Text>
            </View>

            <View style={[Styles.marginBottom12]}>
              <PrimaryButton
                disabled={false}
                is_both={false}
                onPress={() => _onClose()}
                label={props.label}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WhyBasket;
