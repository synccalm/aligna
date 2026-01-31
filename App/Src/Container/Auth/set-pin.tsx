/* File : set-pin.tsx
 * Description : set pin screen for app
 * Author URI : https://evoqins.com
 * Integrations :
 * Version : v1.1
 */
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as RNB from '@sbaiahmed1/react-native-biometrics';
const ReactNativeBiometrics = (RNB as any).default || RNB;
const BiometryTypes = (RNB as any).BiometryTypes || { TouchID: 'TouchID', FaceID: 'FaceID', Biometrics: 'Biometrics' };

import { Styles } from '../../../Theme';
import Images from '../../../Assets/Images';
import HeaderTab from '../../Components/Tabs/header-tab';
import { OtpInput } from '../../Components/TextInputs';
import { PrimaryButton } from '../../Components/Buttons';
// import { BiometricLoginModal } from '../../Components/Modals';
import { myEdges } from '../../../Helper/type-models';
import { useNavigation } from '@react-navigation/native';
import { Statusbar } from '../../Components/StatusBar';
import { AuthContext } from '../../../Navigator/router';

const SetPin: React.FC = () => {
  const rnBiometrics = new ReactNativeBiometrics();

  //const { signIn } = useContext<AuthContextProps>(AuthContext);
  const navigation = useNavigation();

  const { signIn } = React.useContext<any>(AuthContext); //--- IGNORE ---

  // reference declarations
  const pinInputRef = useRef<TextInput>(null);
  const confirmPinInputRef = useRef<TextInput>(null);

  // useStates declarations
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [newPinError, setNewPinError] = useState<string>('');
  const [confirmPinError, setConfirmPinError] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setApiLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    setNewPinError('');
  }, [newPin]);

  useEffect(() => {
    setConfirmPinError('');
    if (confirmPin?.length === 4) {
      Keyboard.dismiss();
    }
  }, [confirmPin]);

  useEffect(() => {
    if (isEnabled == true) {
      Keyboard.dismiss();
      _handleVerify();
      // setShowBiometricModal(true);
    }
  }, [isEnabled]);

  // handling new pin
  const _handleNewPin = (status: boolean, pin: string) => {
    setNewPin(pin);
    if (status) {
      confirmPinInputRef.current?.focus();
    }
  };

  //handling confirmation of pin
  const _handleConfirmPin = (status: boolean, pin: string) => {
    setConfirmPin(pin);
  };

  //  pins validation
  const _validatePins = () => {
    if (newPin.length !== 4) {
      setNewPinError('Invalid PIN');
      return false;
    }
    if (confirmPin.length !== 4) {
      setConfirmPinError('Invalid PIN');
      return false;
    }
    if (newPin !== confirmPin) {
      setConfirmPinError('PIN does not match');
      return false;
    }
    return true;
  };

  // configure-pin API
  async function _handlePrimaryButton() {
    signIn();
  }

  const _handleVerify = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    console.log('biometryType', biometryType, biometryType === BiometryTypes.TouchID, available);

    if (available) {
      //do something fingerprint specific
      _handleBiometrics();
    } else {
      // dummy test cases
    }
  };

  async function _handleBiometrics() {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Verify biometric',
        fallbackPromptMessage: 'Use device passcode',
      });

      if (success) {
        console.log('Biometric verification successful');
        setApiLoading(true);
        const is_valid = _validatePins();
        if (is_valid == true) {
          navigation.navigate('riskProfile');
          setApiLoading(false);
        } else {
          setApiLoading(false);
        }
        //signIn();
      } else {
        setIsEnabled(false);
        setApiLoading(false);
      }
    } catch (error) {
      console.warn('Biometric error:', error);
    }
  }

  return (
    <SafeAreaView style={[Styles.flexOne]} edges={myEdges}>
      {/* status bar */}
      <Statusbar type={1} />

      <View style={[Styles.flexOne]}>
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
                  Add an Extra Layer of Security
                </Text>
              </View>

              <OtpInput
                label={'Enter MPIN'}
                isMandatory={true}
                error={newPinError}
                //    pinInvalid={invalidPin}     //? props to handle clear otp-Input-field
                inputRef={pinInputRef}
                onFocus={() => null}
                autoFocus={true}
                is_timer={false}
                onChangeValue={_handleNewPin}
              />

              <OtpInput
                label={'Confirm MPIN'}
                isMandatory={true}
                error={confirmPinError}
                //    pinInvalid={invalidPin}     //? props to handle clear otp-Input-field
                inputRef={confirmPinInputRef}
                onFocus={() => null}
                autoFocus={false}
                is_timer={false}
                onChangeValue={_handleConfirmPin}
              />
            </ScrollView>

            <View style={[Styles.marginBottom24]}>
              <View
                style={[
                  Styles.row,
                  Styles.marginBottom24,
                  Styles.backgroundColorPureWhite,
                  Styles.paddingHorizontal16,
                  Styles.paddingVertical16,
                  Styles.borderRadius24,
                  Styles.borderWidth1,
                  Styles.borderColorDarkGainsboro,
                ]}
              >
                <View style={[Styles.width234]}>
                  <Text
                    style={[
                      Styles.fontSize12,
                      Styles.lineHeight16,
                      Styles.rubikMedium,
                      Styles.colorCynder,
                    ]}
                  >
                    Unlock using biometric
                  </Text>
                  <Text
                    style={[
                      Styles.paddingTop6,
                      Styles.fontSize12,
                      Styles.lineHeight16,
                      Styles.rubikRegular,
                      Styles.colorIronSideGrey,
                    ]}
                  >
                    Use your device’s biometric lock to login to the FundsApp with bease
                  </Text>
                </View>

                <LinearGradient
                  colors={isEnabled ? ['#D3D3D3', '#E6E6E6'] : ['#E0E0E0', '#B0B0B0']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0.5, y: 0 }}
                  style={[Styles.width52, Styles.height24, Styles.borderRadius32]}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsEnabled(!isEnabled)}
                    style={[Styles.width52, Styles.height24]}
                  >
                    <View
                      style={[
                        Styles.width24,
                        Styles.height24,
                        Styles.borderRadius32,
                        Styles.backgroundColorPrimary,
                        isEnabled
                          ? Styles.backgroundColorsDarkPrimary
                          : Styles.backgroundColorsDarkPrimary,
                        { alignSelf: isEnabled ? 'flex-end' : 'flex-start' },
                      ]}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <Text
                style={[
                  Styles.fontSize10,
                  Styles.lineHeight16,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                  Styles.marginRight4,
                ]}
              >
                Join with confidence! We value transparency. By continuing, you agree to our
                <Text
                  style={[
                    Styles.fontSize10,
                    Styles.lineHeight16,
                    Styles.rubikMedium,
                    Styles.colorPrimary,
                    Styles.marginRight4,
                  ]}
                >
                  Terms of services
                </Text>
                and
                <Text
                  style={[
                    Styles.marginLeft12,
                    Styles.fontSize10,
                    Styles.lineHeight16,
                    Styles.rubikMedium,
                    Styles.colorPrimary,
                  ]}
                >
                  Privacy Policy
                </Text>
                .
              </Text>

              <View style={[Styles.marginTop16]}>
                <PrimaryButton
                  loading={apiLoading}
                  type={2}
                  disabled={(newPin && confirmPin).length < 4}
                  onPress={() => _handlePrimaryButton()}
                  label={'Continue'}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* {showBiometricModal && (
        <BiometricLoginModal
          show={showBiometricModal}
          sensor={sensor}
          onTouch={_handleTouchSensor}
          onClose={_handleClose}
        />
      )} */}
    </SafeAreaView>
  );
};

export default SetPin;
