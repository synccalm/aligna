/*
 *   File :otp-modal.jsx
 *   Author URI : https://evoqins.com
 *   Description : otp modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { OtpInput } from '../TextInputs';
import { Keyboard } from 'react-native';
import { PrimaryButton } from '../Buttons';

// props
type OtpModalProps = {
  show: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
};
const OtpModal: React.FC<OtpModalProps> = (props: OtpModalProps) => {
  // reference declarations
  const OtpRef = useRef();

  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [invalidPin, setInvalidPin] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [resend, setResend] = useState<boolean>(false);

  console.log('resend:', resend);

  useEffect(() => {
    setTimeout(() => {
      setApiLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    setOtpError('');
    if (otp.length === 4) {
      Keyboard.dismiss();
    }
  }, [otp]);

  // callback - reset invalid otp variable
  useEffect(() => {
    if (invalidPin === true) {
      setTimeout(() => {
        setInvalidPin(false);
      }, 900);
    }
  }, [invalidPin]);

  // resend timer
  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setResend(false);
    }
  }, [timer]);

  //handling set otp
  const _handlePin = (status, otp) => {
    setOtp(otp);
    if (status) {
      OtpRef.current.blur();
    }
  };

  //handling resend otp
  const _resendOTP = () => {
    setResend(true);
    setTimer(30);
  };

  //validating otp
  const _validatePin = () => {
    if (otp.length != 4) {
      setOtpError('Invalid PIN');
      setInvalidPin(true); //? Clear otp-Input-field
      return false;
    }
    return true;
  };

  //handling button
  const _handlePrimaryButton = () => {
    setApiLoading(true);
    const valid = _validatePin();
    if (valid) {
      setTimeout(() => {
        props.onSubmit();
        setApiLoading(false);
      }, 300);
    } else {
      setTimeout(() => {
        setApiLoading(false);
      }, 300);
    }
  };

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
                Styles.backgroundColorPureWhite,
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
              Enter OTP to confirm withdraw
            </Text>
            <View>
              <OtpInput
                label={'Enter OTP'}
                isMandatory={true}
                error={otpError}
                pinInvalid={invalidPin} //? props to handle clear otp-Input-field
                inputRef={OtpRef}
                onFocus={() => null}
                autoFocus={true}
                is_timer={true}
                time={timer}
                onChangeValue={_handlePin}
              />
            </View>

            <View style={[Styles.row, Styles.marginTopMinus12]}>
              <View>
                <Text
                  style={[
                    Styles.fontSize12,
                    Styles.lineHeight16,
                    Styles.rubikRegular,
                    Styles.colorIronSideGrey,
                  ]}
                >
                  Didn’t get an OTP?{' '}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={timer != 0}
                onPress={() => _resendOTP()}
              >
                <Text
                  style={[
                    timer != 0 ? Styles.colorGreyOpacity80 : Styles.colorPrimary,
                    Styles.fontSize12,
                    Styles.rubikRegular,
                    Styles.lineHeight16,
                  ]}
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
              {/* )} */}
            </View>
          </View>
          <View style={[Styles.marginBottom12, Styles.paddingHorizontal16, Styles.marginTop32]}>
            <PrimaryButton
              disabled={apiLoading}
              is_both={false}
              onPress={() => _handlePrimaryButton()}
              label={'Proceed'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OtpModal;
