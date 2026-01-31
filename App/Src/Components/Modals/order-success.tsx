/*
 *   File :order success.jsx
 *   Author URI : https://evoqins.com
 *   Description : order success modal
 *   Integrations : nil
 *   Version : v1.1
 */
import { View, Text, Modal, Image } from 'react-native';
import React from 'react';

import { BlurView } from '@react-native-community/blur';
import Images from '../../../Assets/Images';
import { Styles } from '../../../Theme';
import { PrimaryButton } from '../Buttons';

// Define the type of data object
type SuccessProps = {
  show: boolean;
  content: string;
  // errorToast: any;
  fromDate: string;
  pauseDate: string;
  type: number;
  btnType: number;
  message: string;
  label: string;
  image_type?: number;
  onPress: () => void;
  onClose: () => void;
};

const OrderSuccessModal: React.FC<SuccessProps> = (props: SuccessProps) => {
  // Function - handle close
  const _onClose = () => {
    props.onClose();
  };

  // Function - on press
  const _handleOnPress = () => {
    props.onPress?.();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType={'fade'}
      transparent={true}
      visible={props.show}
      onRequestClose={() => _onClose()}
    >
      <View style={[Styles.positionAbsolute]}>
        <BlurView
          style={[Styles.positionAbsolute]}
          blurType="light" // "light" | "dark" | "xlight"
          blurAmount={1} // 👈 make this higher (10–25) for visible blur
          reducedTransparencyFallbackColor="white"
        />
        <View style={[Styles.flexOne, Styles.alignItemsCenter, Styles.justifyFlexEnd]}>
          <View
            style={[
              Styles.borderWidth2,
              Styles.borderColorWhite,
              Styles.fullWidth,
              Styles.borderTopLeftRadius12,
              Styles.borderTopRightRadius12,
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
                  Styles.marginBottom16,
                ]}
              />

              <Image
                source={
                  props.image_type == 1
                    ? Images.success
                    : props.image_type == 3
                    ? Images.external_success
                    : Images.round_success
                }
                style={[
                  props.image_type == 1
                    ? [Styles.height80, Styles.width62]
                    : [Styles.height88, Styles.Width88],
                  Styles.alignSelfCenter,
                  Styles.marginBottom24,
                ]}
                resizeMode="contain"
              />
              <Text
                style={[
                  Styles.rubikMedium,
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.colorCynder,
                  Styles.textAlignCenter,
                ]}
              >
                {props.content}
                {/* Redemption Successful! */}
              </Text>

              <View style={[Styles.paddingTop16]}>
                <Text
                  style={[
                    Styles.rubikRegular,
                    Styles.fontSize14,
                    Styles.colorCynder,
                    Styles.lineHeight20,
                    Styles.textAlignCenter,
                  ]}
                >
                  {props.message}
                </Text>
              </View>
            </View>
            <View style={[Styles.paddingBottom24, Styles.paddingTop40, Styles.paddingHorizontal16]}>
              <PrimaryButton
                type={props.btnType ? props.btnType : 1}
                loading={false}
                isDisabled={false}
                card={false}
                label={props.label}
                onPress={_handleOnPress}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OrderSuccessModal;
