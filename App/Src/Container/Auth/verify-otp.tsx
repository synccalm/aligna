/* File : verify-otp.tsx
 * Description : verify otp screen for app
 * Author URI : https://evoqins.com
 * Integrations :
 * Version : v1.1
 */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from '../../../Theme';
import Images from '../../../Assets/Images';
import HeaderTab from '../../Components/Tabs/header-tab';
import { useNavigation } from '@react-navigation/native';
import { OtpInput } from '../../Components/TextInputs';
import { PrimaryButton } from '../../Components/Buttons';
import { Keyboard } from 'react-native';
import { myEdges } from '../../../Helper/type-models';
import { Statusbar } from '../../Components/StatusBar';

const VerifyOtp: React.FC = () => {
  // navigation variable
  const navigation = useNavigation<NavigationType>();

  // reference declarations
  const OtpRef = useRef();

  // useStates declarations
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [invalidPin, setInvalidPin] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [resend, setResend] = useState<boolean>(false);

  console.log('timer:', timer, resend);

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
      navigation.navigate('set-pin');
      setApiLoading(false);
    } else {
      setApiLoading(false);
    }
  };

  return (
    <SafeAreaView style={[Styles.flexOne]} edges={myEdges}>
      {/* status bar */}
      <Statusbar type={1} />
      <ImageBackground
        source={Images.background_gradient}
        style={[Styles.fullWidth, Styles.fullHeight]}
      >
        <View style={[Styles.flexOne, Styles.paddingTop20, Styles.paddingHorizontal16]}>
          <HeaderTab navigationEnabled={true} type={1} icon={true} />
          <ScrollView
            style={[Styles.flexOne]}
            keyboardShouldPersistTaps={'always'}
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[Styles.flexGrowOne]}
            overScrollMode={'never'}
          >
            <View style={[Styles.paddingTop25, Styles.paddingBottom16]}>
              <Text
                style={[
                  Styles.fontSize28,
                  Styles.lineHeight36,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                Almost There!
              </Text>
              <Text
                style={[
                  Styles.fontSize28,
                  Styles.lineHeight36,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                Enter the Code
              </Text>
            </View>

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
          </ScrollView>

          <View style={[Styles.marginBottom24]}>
            <Text
              style={[
                Styles.fontSize10,
                Styles.lineHeight16,
                Styles.rubikRegular,
                Styles.colorIronSideGrey,
              ]}
            >
              Join with confidence! We value transparency. By continuing, you agree to our{' '}
              <Text
                style={[
                  Styles.fontSize10,
                  Styles.lineHeight16,
                  Styles.rubikMedium,
                  Styles.colorDarkPrimary,
                ]}
              >
                Terms of services{' '}
              </Text>
              and{' '}
              <Text
                style={[
                  Styles.fontSize10,
                  Styles.lineHeight16,
                  Styles.rubikMedium,
                  Styles.colorDarkPrimary,
                ]}
              >
                Privacy Policy
              </Text>
              .
            </Text>

            <View style={[Styles.marginTop16, Styles.paddingBottom16]}>
              <PrimaryButton
                loading={apiLoading}
                type={2}
                disabled={otp.length != 4}
                onPress={() => _handlePrimaryButton()}
                label={'Continue'}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default VerifyOtp;
