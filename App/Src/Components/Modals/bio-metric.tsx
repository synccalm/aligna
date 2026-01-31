/*
 *   File :bio-metric.jsx
 *   Author URI : https://evoqins.com
 *   Description : bio metric modal
 *   Integrations : nil
 *   Version : v1.1
 */
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { Styles } from '../../../Theme';
import Images from '../../../Assets/Images';
import * as RNB from '@sbaiahmed1/react-native-biometrics';
const ReactNativeBiometrics = (RNB as any).default || RNB;
const BiometryTypes = (RNB as any).BiometryTypes || { TouchID: 'TouchID', FaceID: 'FaceID', Biometrics: 'Biometrics' };
// props
type LoginBiometricProp = {
  show: boolean;
  onTouch?: () => void;
  sensor: boolean;
  onClose?: () => void;
  onVerify?: () => void;
};
const BiometricLoginModal: React.FC<LoginBiometricProp> = (props: LoginBiometricProp) => {
  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    if (props.show) {
      _handleVerify();
    }
  }, []);

  // handle onClose
  const _onClose = () => {
    props.onClose?.();
  };

  const _handleVerify = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    console.log('biometryType', biometryType, biometryType === BiometryTypes.TouchID, available);

    if (available) {
      //do something fingerprint specific
      _handleBiometrics();
    } else {
      // dummy test cases
      props.onVerify?.();
      props.onClose?.();
    }
  };

  async function _handleBiometrics() {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Verify your identity',
        fallbackPromptMessage: 'Use device passcode',
      });

      if (success) {
        console.log('Biometric verification successful');
        props.onVerify?.();
        props.onClose?.();
      } else {
        console.log('Biometric verification cancelled or failed');
      }
    } catch (error) {
      console.warn('Biometric error:', error);
    }
  }

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent
      visible={props.show}
      onRequestClose={_onClose}
    >
      <View
        style={[
          Styles.flexOne,
          Styles.alignItemsCenter,
          Styles.justifyFlexEnd,
          Styles.backgroundColorModal,
        ]}
      >
        <View
          style={[
            Styles.padding16,
            Styles.borderTopLeftRadius8,
            Styles.borderTopRightRadius8,
            Styles.backgroundColorPureWhite,
            Styles.fullWidth,
          ]}
        >
          <View style={[Styles.center, Styles.paddingTop6]}>
            <Text
              style={[
                Styles.fontSize16,
                Styles.lineHeight18,
                Styles.rubikMedium,
                Styles.colorCynder,
              ]}
            >
              Verify biometric
            </Text>
            {/* logo */}
            <Image
              source={Images.finger_print}
              style={[Styles.height62, Styles.width62, Styles.marginTop24, Styles.marginBottom24]}
            />
            <Text
              style={[
                Styles.fontSize12,
                Styles.lineHeight14,
                Styles.rubikRegular,
                Styles.colorDarkPrimary,
              ]}
            >
              Touch the fingerprint sensor
            </Text>
          </View>

          <TouchableOpacity
            style={[Styles.paddingTop57, Styles.paddingBottom4]}
            onPress={() => _onClose()}
          >
            <Text
              style={[
                Styles.fontSize14,
                Styles.lineHeight16,
                Styles.rubikMedium,
                Styles.colorBlack,
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BiometricLoginModal;
