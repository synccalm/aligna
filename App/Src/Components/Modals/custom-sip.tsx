/*
 *   File :custom-sip.jsx
 *   Author URI : https://evoqins.com
 *   Description : custom-sip modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { PrimaryButton } from '../Buttons';

// props
type CustomSipDetailProps = {
  show: boolean;
  onClose?: () => void;
};
const CustomSipDetail: React.FC<CustomSipDetailProps> = (props: CustomSipDetailProps) => {
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
                Styles.backgroundColorPureWhite,
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
                Styles.textAlignCenter,
              ]}
            >
              You’re editing the recommended SIP amount.
            </Text>

            <View style={[Styles.paddingTop16, Styles.marginBottom24]}>
              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                  Styles.textAlignCenter,
                ]}
              >
                Youre customizing your SIP. If its less than the recommended amount, your goal
                timeline will be extended automatically to keep things on track.
              </Text>
            </View>

            <View style={[Styles.marginBottom12]}>
              <PrimaryButton
                disabled={false}
                is_both={true}
                onPressSec={() => _onClose()}
                onPress={() => _handlePrimaryButton()}
                secLabel={'Back'}
                primaryLabel={'Continue'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomSipDetail;
