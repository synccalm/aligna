/* File : signup.tsx
 * Description : signup screen for app
 * Author URI : https://evoqins.com
 * Integrations :
 * Version : v1.1
 */
import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { Styles } from '../../../Theme';
import Images from '../../../Assets/Images';
import HeaderTab from '../../Components/Tabs/header-tab';
import { useNavigation } from '@react-navigation/native';
import { PhoneTextInput } from '../../Components/TextInputs';
import { PrimaryButton } from '../../Components/Buttons';
import { myEdges } from '../../../Helper/type-models';
import { Statusbar } from '../../Components/StatusBar';
import { AuthContext } from '../../../Navigator/router';

const Signup: React.FC = () => {
  // navigation variable
  const navigation = useNavigation<NavigationType>();

  // reference declarations
  const phoneRef = useRef<TextInput | null>(null);

  const { signIn } = useContext(AuthContext);

  // useStates declarations
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  useEffect(() => {
    setPhoneError('');
  }, [phone]);

  //handling phone number
  const _handlePhone = (value: string) => {
    if (value.length == 10) {
      phoneRef.current?.blur();
    }
    setPhone(value);
  };

  const _handlePrimaryButton = () => {
    setApiLoading(true);
    // const is_valid = _validatePhone();
    // console.log('is_valid:', is_valid);

    // if (is_valid == true) {
    //   navigation.navigate('verify-otp', { phone: phone });
    //   setApiLoading(false);
    // } else {
    //   setApiLoading(false);
    // }
    signIn();
  };

  // phone number validation
  const _validatePhone = () => {
    const phone_regex = /^[6-9]\d{9}$/gi;
    if (phone.length == 0) {
      setPhoneError('Mobile number is required');
      phoneRef.current?.focus();
      return false;
    } else if (phone.length != 10) {
      setPhoneError('Enter a valid mobile number');
      phoneRef.current?.focus();
      return false;
    } else if (phone_regex.test(phone) == false) {
      setPhoneError('Enter a valid mobile number');
      phoneRef.current?.focus();
      return false;
    }
    return true;
  };

  const _handleGooglebutton = async () => {
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   console.log('User Info:--->', userInfo);
    //   navigation.navigate('verify-otp', { phone: '9898989898' });
    // } catch (error) {
    //   console.log('Google Sign-In Error:', error);
    // }
  };

  return (
    <SafeAreaView style={[Styles.flexGrowOne]} edges={myEdges}>
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
              <View style={[Styles.paddingTop25]}>
                <Text
                  style={[
                    Styles.fontSize28,
                    Styles.lineHeight36,
                    Styles.rubikRegular,
                    Styles.colorCynder,
                  ]}
                >
                  Your Smarter Investment Journey Starts Here
                </Text>
              </View>

              <View style={[Styles.paddingTop25]}>
                <PhoneTextInput
                  label={'Your Mobile number'}
                  isMandatory={true}
                  value={phone}
                  inputRef={phoneRef}
                  placeholder={'Phone number'}
                  error={phoneError}
                  editable={false}
                  // onPressIcon={_handleIcon}
                  onChangeValue={_handlePhone}
                />
              </View>

              <View style={[Styles.rowCenter, Styles.paddingTop20]}>
                <View
                  style={[
                    Styles.height1,
                    Styles.backgroundColorLightSilver,
                    Styles.width138,
                    Styles.marginRight12,
                  ]}
                />
                <Text
                  style={[
                    Styles.fontSize12,
                    Styles.lineHeight16,
                    Styles.rubikRegular,
                    Styles.justifyCenter,
                    Styles.colorDarkSilver,
                  ]}
                >
                  Or
                </Text>
                <View
                  style={[
                    Styles.height1,
                    Styles.backgroundColorLightSilver,
                    Styles.width138,
                    Styles.marginLeft12,
                  ]}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => _handleGooglebutton()}
                style={[
                  Styles.marginTop16,
                  Styles.borderWidth2,
                  Styles.row,
                  Styles.borderColorDarkPrimary,
                  Styles.paddingVertical14,
                  Styles.borderRadius24,
                  Styles.center,
                ]}
              >
                <Image
                  source={Images.google_icon}
                  style={[Styles.height20, Styles.width20, Styles.marginRight8]}
                />
                <Text
                  style={[
                    Styles.fontSize14,
                    Styles.lineHeight16,
                    Styles.colorCynder,
                    Styles.rubikMedium,
                  ]}
                >
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={[Styles.marginBottom24]}>
              <Text
                style={[
                  Styles.fontSize10,
                  Styles.lineHeight16,
                  Styles.rubikRegular,
                  Styles.colorIronSideGrey,
                  Styles.marginRight4,
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
                  disabled={phone.length != 10}
                  onPress={() => _handlePrimaryButton()}
                  label={'Verify'}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
