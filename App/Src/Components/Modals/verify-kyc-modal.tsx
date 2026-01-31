/*
 *   File :verify-kyc-modal.jsx
 *   Author URI : https://evoqins.com
 *   Description : verify-kyc-modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import { Styles } from '../../../Theme';
import FastImage from 'react-native-fast-image';

import { BlurView } from '@react-native-community/blur';
import Images from '../../../Assets/Images';
import { useNavigation } from '@react-navigation/native';

// props
type VerifyKycModalProps = {
  show: boolean;
  type?: number;
  title?: string;
  sub_title?: string;
  content?: string;
  label?: string;
  onClose?: () => void;
};
const VerifyKycModal: React.FC<VerifyKycModalProps> = (props: VerifyKycModalProps) => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (props.show) {
      timer = setTimeout(() => {
        props.onClose?.();
        if (props.type == 1) {
          navigation.replace('bank-verified', { type: props.type });
        } else if (props.type == 2) {
          navigation.replace('bank-verified', { type: props.type });
        }
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [props.show]);

  return (
    <Modal statusBarTranslucent animationType="slide" transparent visible={props.show}>
      <View style={[Styles.positionAbsolute]}>
        <BlurView
          style={[Styles.positionAbsolute]}
          blurType="light" // "light" | "dark"
          // | "xlight"
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
                Styles.backgroundColorGreyOpacity10,
                Styles.Width72,
                Styles.marginBottom8,
              ]}
            />

            <FastImage
              source={Images.loading}
              style={[
                Styles.alignSelfCenter,
                Styles.height12,
                Styles.Width55,
                Styles.marginTop40,
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
                Styles.paddingBottom8,
              ]}
            >
              {props.title}
            </Text>

            <View style={[Styles.paddingTop8, Styles.paddingBottom32]}>
              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                  Styles.textAlignCenter,
                ]}
              >
                {props.content}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyKycModal;
