/* File : signup.tsx
 * Description : signup screen for app
 * Author URI : https://evoqins.com
 * Integrations :
 * Version : v1.1
 */
import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { firebase } from '@react-native-firebase/app';
import auth, { getAuth, AppleAuthProvider, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { Alert } from 'react-native';


import { COLORS, Styles } from '../../../Theme';
import Images from '../../../Assets/Images';
import HeaderTab from '../../Components/Tabs/header-tab';
import { useNavigation } from '@react-navigation/native';
import { PhoneTextInput } from '../../Components/TextInputs';
import { PrimaryButton } from '../../Components/Buttons';
import { myEdges } from '../../../Helper/type-models';
import { Statusbar } from '../../Components/StatusBar';
import { AuthContext } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';

const Signup: React.FC = () => {
  // navigation variable
  const navigation = useNavigation<any>();

  const [googleLoader, setGoogleLoader] = useState(false);
  const [appleLoader, setAppleLoader] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const authContext = useContext(AuthContext);
  const signIn = authContext?.signIn;




  const _handleGooglebutton = async () => {
    if (!isTermsAccepted) {
      Alert.alert('Terms Required', 'Please accept the Terms and Conditions to continue.');
      return;
    }
    setGoogleLoader(true);
    GoogleSignin.configure({
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      accountName: 'Aligna',
      webClientId: '933201863300-pvqhjmsh6d1n63ac47bli42fgqekkgoe.apps.googleusercontent.com', // TODO  we need to change in production
      iosClientId: '933201863300-pvqhjmsh6d1n63ac47bli42fgqekkgoe.apps.googleusercontent.com', // from GoogleService-Info.plist CLIENT_ID
      // androidClientId: '477724491197-onttqmeomic4nlnhfecn6ksp613epj6s.apps.googleusercontent.com', // TODO  we need to change in production
      scopes: ['profile', 'email']
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.type !== 'success' || !userInfo?.data) {
        // User cancelled or no user returned
        return;
      }
      console.log('User Info:--->', userInfo);
      await _firebaseAuth(userInfo);
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      setGoogleLoader(false);
    }
  };

  const _onAppleButtonPress = async () => {
    if (!isTermsAccepted) {
      Alert.alert('Terms Required', 'Please accept the Terms and Conditions to continue.');
      return;
    }
     setAppleLoader(true);
    try {
      if (Platform.OS !== 'ios' || !appleAuth.isSupported) {
        console.log('Apple Sign-In Not Supported', 'iOS 13+ only');
        return;
      }

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        return
      }
      console.log("appleAuthRequestResponse", appleAuthRequestResponse)

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = AppleAuthProvider.credential(identityToken, nonce);

      let response = await signInWithCredential(getAuth(), appleCredential);
      let user = response?.user;
      let idToken = await user?.getIdToken();
      console.log("resp ------", response)
      console.log("resp ", idToken)
      if (idToken && signIn) {
        signIn(idToken);
      }


    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      setAppleLoader(false);
    }
  };


  const _firebaseAuth = async () => {
    try {
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        console.warn('Google Sign-In: no idToken for Firebase');
        return;
      }

      const googleCredential =
        auth.GoogleAuthProvider.credential(idToken);

      const userCredential =
        await auth().signInWithCredential(googleCredential);

      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      console.log('Firebase auth success:', firebaseUser.uid, token);
      if (token && signIn) {
        signIn(token);
      }
      setGoogleLoader(false);
       setAppleLoader(false);

    } catch (error) {
      console.error('Firebase auth (Google) Error:', error);
      setGoogleLoader(false);
      setAppleLoader(false);
    }
  };

  return (
    <SafeAreaView style={[Styles.flexGrowOne]} edges={myEdges}>
      {/* status bar */}
      <Statusbar type={1} />

      <View style={[Styles.flexOne]}>

        <View style={[Styles.flexOne, Styles.center, Styles.paddingTop20, Styles.paddingHorizontal16]}>







          <TouchableOpacity
            // activeOpacity={0.8}
            onPress={() => _handleGooglebutton()}
            style={[
              Styles.marginTop16,
              Styles.borderWidth2,
              Styles.row,
              Styles.borderColorDarkPrimary,
              Styles.paddingVertical14,
              Styles.borderRadius24,
              Styles.center,
              Styles.width328
            ]}
          >
            {
              (!googleLoader) &&
            <Image
              source={Images.google_icon}
              style={[Styles.height20, Styles.width20, Styles.marginRight8]}
            />
            }
            {
              (googleLoader) ?
                <ActivityIndicator size={"small"} color={COLORS.CYNDER} />
                :
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
            }
          </TouchableOpacity>

          <TouchableOpacity
            // activeOpacity={0.8}
            onPress={() => _onAppleButtonPress()}
            style={[
              Styles.marginTop16,
              Styles.borderWidth2,
              Styles.row,
              Styles.borderColorDarkPrimary,
              Styles.paddingVertical14,
              Styles.borderRadius24,
              Styles.center,
              Styles.width328
            ]}
          > 
          {
            (!appleLoader) &&
            <Image
              source={require('../../../Assets/img/apple_logo.png')}
              style={[Styles.height20, Styles.width20, Styles.marginRight8]}
            />
          }
            {
              (appleLoader) ?
                <ActivityIndicator size={"small"} color={COLORS.CYNDER} />
                :
                <Text
                  style={[
                    Styles.fontSize14,
                    Styles.lineHeight16,
                    Styles.colorCynder,
                    Styles.rubikMedium,
                  ]}
                >
                   Continue with Apple
                </Text>
            }
          </TouchableOpacity>

          {/* Terms and Conditions Checkbox */}
        <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          
          <TouchableOpacity
            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            style={{ padding: 8 }}
          >
            {/* Re-using Icon component or similar if available, else simple View */}
            <View style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: COLORS.CYNDER,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8
            }}>
              {isTermsAccepted && <View style={{ width: 14, height: 14, backgroundColor: COLORS.CYNDER, borderRadius: 2 }} />}
            </View>
          </TouchableOpacity>
          <Text style={[Styles.fontSize12, Styles.rubicRegualr, { color: COLORS.CYNDER, flex: 1, marginLeft: 8 }]}>
            By continuing to use this app, you agree to our{' '}
            <Text
              style={{ textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL('https://synccalm.com/terms')}
            >
              Terms and Conditions
            </Text>
            {' '}and{' '}
            <Text
              style={{ textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL('https://synccalm.com/privacy')}
            >
              Privacy Policy
            </Text>.
          </Text>
        </View>


        </View>


         <View style={[Styles.padding16, { paddingBottom: 40, alignItems: 'center', opacity: 0.6 }]}>
            <View style={{ width: 40, height: 2, backgroundColor: COLORS.CHARCOL, opacity: 0.1, marginBottom: 16 }} />

            <Text style={[Styles.rubicMedium, { fontSize: 10, color: COLORS.CHARCOL, textTransform: 'uppercase', letterSpacing: 3 }]}>
              SyncCalm Studios
            </Text>

            <Text style={[Styles.rubicRegualr, { fontSize: 12, color: COLORS.CHARCOL, opacity: 0.5, marginTop: 4, fontStyle: 'italic' }]}>
              Crafted for your inner peace
            </Text>
          </View>

      </View>
    </SafeAreaView>
  );
};

export default Signup;
