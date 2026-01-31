/* File : verify-pin.tsx
 * Description : verify pin screen for app
 * Author URI : https://evoqins.com
 * Integrations :
 * Version : v1.1
 */
import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from '../../../Theme';
import Images from '../../../Assets/Images';
import HeaderTab from '../../Components/Tabs/header-tab';
import { useNavigation } from '@react-navigation/native';
import { OtpInput } from '../../Components/TextInputs';
import { PrimaryButton } from '../../Components/Buttons';
import { myEdges } from '../../../Helper/type-models';
import { AuthContext } from '../../../Navigator/router';
import { Statusbar } from '../../Components/StatusBar';

const VerifyPin: React.FC = () => {
  // navigation variable
  const navigation = useNavigation<NavigationType>();

  // reference declarations
  const pinRef = useRef();

  const { signIn } = useContext<AuthContextProps>(AuthContext);

  // useStates declarations
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [invalidPin, setInvalidPin] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setApiLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    setPinError('');
    if (pin.length === 4) {
      Keyboard.dismiss();
    }
  }, [pin]);

  // callback - reset invalid pin variable
  useEffect(() => {
    if (invalidPin === true) {
      setTimeout(() => {
        setInvalidPin(false);
      }, 900);
    }
  }, [invalidPin]);

  //handling set pin
  const _handlePin = (status, pin) => {
    setPin(pin);
    if (status) {
      pinRef.current.blur();
    }
  };

  //handling resend pin
  const _forgotPin = () => {
    navigation.navigate('verify-otp', { phone: '8989898989' });
  };

  //validating pin
  const _validatePin = () => {
    if (pin.length != 4) {
      setPinError('Invalid PIN');
      setInvalidPin(true); //? Clear pin-Input-field
      return false;
    }
    return true;
  };

  //handling button
  const _handlePrimaryButton = () => {
    const valid = _validatePin();
    if (valid) {
      setApiLoading(true);
      signIn();
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
                Verify Its You Enter Your PIN
              </Text>
            </View>

            <OtpInput
              label={'Enter MPIN'}
              isMandatory={true}
              error={pinError}
              pinInvalid={invalidPin} //? props to handle clear pin-Input-field
              inputRef={pinRef}
              onFocus={() => null}
              autoFocus={true}
              is_timer={false}
              onChangeValue={_handlePin}
            />

            <View style={[Styles.marginTopMinus12]}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => _forgotPin()}>
                <Text
                  style={[
                    Styles.colorDarkPrimary,
                    Styles.fontSize12,
                    Styles.rubikRegular,
                    Styles.lineHeight16,
                  ]}
                >
                  Forgot MPIN?
                </Text>
              </TouchableOpacity>
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
              Join with confidence! We value transparency. By continuing, you agree to our
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
                disabled={pin.length != 4}
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

export default VerifyPin;
