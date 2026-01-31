/*
 *   File :fund-detail.jsx
 *   Author URI : https://evoqins.com
 *   Description : fund detail modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';

// props
type FundDetailProps = {
  show: boolean;
  onClose?: () => void;
};
const FundDetailModal: React.FC<FundDetailProps> = (props: FundDetailProps) => {
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
            Styles.backgroundColorPureWhite,
          ]}
        >
          <View style={[Styles.padding16]}>
            <View
              style={[
                Styles.alignSelfCenter,
                Styles.height1,
                Styles.backgroundColorLightishSilver,
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
              Details
            </Text>

            <View style={[Styles.paddingTop16, Styles.paddingBottom16]}>
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight16,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                ICICI Prudential Mutual Fund is one of Indias leading asset management companies,
                known for its strong research-driven investment approach. It is a joint venture
                between ICICI Bank and Prudential Plc, combining local expertise with global
                experience. The fund house offers a wide range of mutual fund schemes across equity,
                debt, and hybrid categories to cater to diverse investor needs.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FundDetailModal;
