/*
 *   File :verify-upi-payment.jsx
 *   Author URI : https://evoqins.com
 *   Description : verify-upi-payment modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { CustomTextInput } from '../TextInputs';
import Icon from '../../../Assets/icon';

// props
type VerifyUpiPaymentProps = {
  show: boolean;
  title?: string;
  sub_title?: string;
  content?: string;
  type?: number;
  label?: string;
  onClose?: () => void;
};
const VerifyUpiPaymentModal: React.FC<VerifyUpiPaymentProps> = (props: VerifyUpiPaymentProps) => {
  const upiIdValueRef = useRef<TextInput>(null);

  const [upiIdValue, setUpiIdValueRef] = useState<string>('');
  const [upiIdValueError, setUpiIdValueError] = useState<string>('');
  const [focusId, setFocusId] = useState<string>('');

  useEffect(() => {
    setUpiIdValueError('');
  }, [upiIdValue]);

  // Function - handle blur
  const _onBlurAnimation = () => {
    setFocusId('');
  };

  // Function - focus
  const _onFocusAnimation = (val: string) => {
    setFocusId(val);
  };

  // handle onClose
  const _onClose = () => {
    props.onClose?.();
  };

  const _validate = () => {
    if (upiIdValue.length == 0) {
      setUpiIdValueError('Please enter your UPI');
      return false;
    }
    return true;
  };

  //Function to handle the next
  const _handleNext = () => {
    const is_valid = _validate();
    if (is_valid == true) {
      props.onSubmit();
    }
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
                Styles.backgroundColorGreyOpacity10,
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
              {props.title}
            </Text>

            <Text
              style={[
                Styles.fontSize14,
                Styles.lineHeight20,
                Styles.rubikRegular,
                Styles.colorIronSideGrey,
              ]}
            >
              {props.sub_title}
            </Text>

            <View style={[Styles.marginTop16, Styles.marginBottom16]}>
              <CustomTextInput
                id="upi_id"
                prefix={null}
                suffix={null}
                label="Enter UPI ID"
                value={upiIdValue}
                inputRef={upiIdValueRef}
                isMandatory={true}
                error={upiIdValueError}
                placeHolder="Enter UPI Id"
                editable={true}
                focusId={focusId}
                secureTextEntry={false}
                returnKeyType="next"
                maxLength={20}
                keyboardType="none"
                autoCapitalize="words"
                autoFocus={false}
                onChangeText={(val) => setUpiIdValueRef(val)}
                onBlur={() => _onBlurAnimation()}
                onFocus={() => _onFocusAnimation('upiIdValue')}
                autoCompleteType="none"
                onSubmitEditing={() => upiIdValueRef.current?.focus()}
              />

              <Text
                style={[
                  Styles.fontSize10,
                  Styles.lineHeight16,
                  Styles.rubikRegular,
                  Styles.colorDarkCharcoal,
                ]}
              >
                Maximum character limit is 20
              </Text>
            </View>

            <View
              style={[
                Styles.marginBottom12,
                Styles.marginTop40,
                Styles.rowCenter,
                Styles.spaceBetween,
              ]}
            >
              <TouchableOpacity activeOpacity={CONSTANTS.activeOpacity} onPress={() => _onClose()}>
                <Icon name={'arrow-left'} size={CONSTANTS.Width16} color={COLORS.BLACK} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={CONSTANTS.activeOpacity}
                style={[
                  Styles.center,
                  Styles.backgroundColorsDarkPrimary,
                  Styles.height32,
                  Styles.borderRadius24,
                  Styles.rowCenter,
                  Styles.paddingHorizontal24,
                ]}
                onPress={() => _handleNext()}
              >
                <Text
                  style={[
                    Styles.rubikRegular,
                    Styles.fontSize12,
                    Styles.lineHeight16,
                    Styles.colorPureWhite,
                    Styles.textAlignCenter,
                  ]}
                >
                  Next
                </Text>

                <Icon
                  name={'arrow-left'}
                  size={CONSTANTS.Width16}
                  color={COLORS.PURE_WHITE}
                  style={[Styles.marginLeft4, Styles.transForm180]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyUpiPaymentModal;
