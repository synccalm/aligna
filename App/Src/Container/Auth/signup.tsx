/* File : signup.tsx
 * Description : signup screen for app
 * Author URI : https://evoqins.com
 * Integrations :
 * Version : v1.1
 */
import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { firebase } from '@react-native-firebase/app';
import auth, { getAuth, AppleAuthProvider, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';


import { COLORS, Styles } from '../../../Theme';
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

  const [googleLoader, setGoogleLoader] = useState(false);

  const { signIn } = useContext(AuthContext);


  

  const _handleGooglebutton = async () => {
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


        } catch (error: any) {
            console.error('Apple Sign-In Error:', error);
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
        setGoogleLoader(false);

      } catch (error) {
        console.error('Firebase auth (Google) Error:', error);
        setGoogleLoader(false);
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
                <Image
                  source={Images.google_icon}
                  style={[Styles.height20, Styles.width20, Styles.marginRight8]}
                />
                {
                  (googleLoader) ?
                  <ActivityIndicator size={"small"} color= {COLORS.CYNDER}/>
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
                <Image
                  source={require('../../../Assets/img/apple_logo.png')}
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
                  Continue with Apple
                </Text>
              </TouchableOpacity>

          </View>

      </View>
    </SafeAreaView>
  );
};

export default Signup;
