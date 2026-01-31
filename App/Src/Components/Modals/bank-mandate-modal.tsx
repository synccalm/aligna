/*
 *   File :bank-madate-modal.jsx
 *   Author URI : https://evoqins.com
 *   Description : bank-mandate modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';

// props
type BankMandateModalProps = {
  show: boolean;
  title?: string;
  content?: string;
  type?: number;
  label?: string;
  onClose?: () => void;
};
const BankMandateModal: React.FC<BankMandateModalProps> = (props: BankMandateModalProps) => {
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
              ]}
            >
              Mandate details
            </Text>
            <View style={[Styles.rowCenter, Styles.spaceBetween, Styles.paddingTop16]}>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                ]}
              >
                Mandate ID
              </Text>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikMedium,
                  Styles.colorCynder,
                ]}
              >
                FDHLO123456
              </Text>
            </View>

            <View style={[Styles.rowCenter, Styles.spaceBetween, Styles.paddingTop8]}>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                ]}
              >
                Mandate amount
              </Text>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikMedium,
                  Styles.colorCynder,
                ]}
              >
                Up to ₹15,000
              </Text>
            </View>

            <View style={[Styles.rowCenter, Styles.spaceBetween, Styles.paddingTop8]}>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                ]}
              >
                Start date
              </Text>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikMedium,
                  Styles.colorCynder,
                ]}
              >
                23 July 2024
              </Text>
            </View>

            <View
              style={[
                Styles.rowCenter,
                Styles.spaceBetween,
                Styles.paddingTop8,
                Styles.paddingBottom24,
              ]}
            >
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                ]}
              >
                End date
              </Text>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikMedium,
                  Styles.colorCynder,
                ]}
              >
                22 July 2025
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BankMandateModal;
