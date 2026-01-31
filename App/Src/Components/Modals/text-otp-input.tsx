/*
 *   File :text-otp-input.jsx
 *   Author URI : https://evoqins.com
 *   Description : text otp input
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Keyboard } from 'react-native';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { PrimaryButton } from '../Buttons';
import { CustomTextInput } from '../TextInputs';
import Icon from '../../../Assets/icon';

// props
type OtpInputTextProps = {
  show: boolean;
  title?: string;
  content?: string;
  sub_content?: boolean;
  button_label?: string;
  onClose?: () => void;
};
const OtpInputTextModal: React.FC<OtpInputTextProps> = (props: OtpInputTextProps) => {
  const inputOtpRef = useRef<TextInput>(null);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [inputOtpError, setInputOtpError] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [resend, setResend] = useState<boolean>(false);
  const [focusId, setFocusId] = useState<string>('');

  console.log('resend', resend);

  // resend timer
  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setResend(false);
    }
  }, [timer]);

  useEffect(() => {
    setInputOtpError('');
  }, [inputOtp]);

  useEffect(() => {
    setInputOtpError('');
    if (inputOtp.length === 6) {
      Keyboard.dismiss();
    }
  }, [inputOtp]);

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

  //Function to handle the validation
  const _validation = () => {
    if (inputOtp.length == 0) {
      setInputOtpError('Please enter the otp');
      return false;
    } else if (inputOtp.length != 6) {
      setInputOtpError('Please enter valid otp');
      return false;
    }
    return true;
  };

  //Function to handle the primary button
  const _handlePrimaryButton = () => {
    const is_valid = _validation();
    if (is_valid == true) {
      props.onSubmit();
    }
  };

  //handling resend otp
  const _resendOTP = () => {
    setResend(true);
    setTimer(30);
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
              ]}
            >
              Enter OTP sent to
            </Text>

            <View style={[Styles.paddingTop4]}>
              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                Enter the 6-digit OTP sent on +91 9876543210
              </Text>
            </View>

            <View style={[Styles.paddingTop16]}>
              <CustomTextInput
                id="otp_input"
                prefix={null}
                suffix={null}
                label="Enter 6 digit OTP"
                value={inputOtp}
                inputRef={inputOtpRef}
                error={inputOtpError}
                placeHolder="123-456"
                editable={true}
                focusId={focusId}
                secureTextEntry={false}
                returnKeyType="done"
                maxLength={6}
                is_otp={true}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoFocus={false}
                onChangeText={(val) => setInputOtp(val)}
                onBlur={() => _onBlurAnimation()}
                onFocus={() => _onFocusAnimation('inputOtp')}
                autoCompleteType="none"
                onSubmitEditing={() => inputOtpRef.current?.focus()}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={timer != 0}
                onPress={() => _resendOTP()}
                style={[Styles.alignSelfFlexEnd, Styles.rowCenter]}
              >
                <Text
                  style={[
                    timer != 0 ? Styles.colorGreyOpacity80 : Styles.colorCynder,
                    Styles.fontSize14,
                    Styles.rubikRegular,
                    Styles.lineHeight16,
                  ]}
                >
                  Resend OTP
                </Text>

                {timer != 0 && (
                  <Text
                    style={[
                      timer != 0 ? Styles.colorGreyOpacity80 : Styles.colorCynder,
                      Styles.fontSize14,
                      Styles.rubikRegular,
                      Styles.lineHeight16,
                    ]}
                  >
                    (00.{timer}s)
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View
              style={[
                Styles.paddingTop24,
                Styles.row,
                Styles.alignSelfCenter,
                Styles.marginBottom8,
              ]}
            >
              <Icon
                name={'shield'}
                size={CONSTANTS.Width16}
                color={COLORS.SEA_GREEN}
                style={[Styles.marginRight4]}
              />
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight16,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                Your data is safe and secure
              </Text>
            </View>

            <View style={[Styles.marginBottom12]}>
              <PrimaryButton
                disabled={false}
                is_both={false}
                onPress={() => _handlePrimaryButton()}
                label={props.button_label}
              />
            </View>
            {props.sub_content == true && (
              <View style={[Styles.marginBottom16, Styles.marginHorizontal24]}>
                <Text
                  style={[
                    Styles.fontSize10,
                    Styles.lineHeight14,
                    Styles.rubikRegular,
                    Styles.colorCynder,
                    Styles.textAlignCenter,
                  ]}
                >
                  By continuing, you agree to share your data with us. Powered by SEBI - regulated
                  MF Central.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OtpInputTextModal;
