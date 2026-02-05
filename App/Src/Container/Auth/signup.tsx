/* File : signup.tsx
 * Description : signup screen for app
 * Author URI : https://evoqins.com
 * Integrations :
 * Version : v1.1
 */
import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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

  const { signIn } = useContext(AuthContext);


  

  const _handleGooglebutton = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:--->', userInfo);

    } catch (error) {
      console.log('Google Sign-In Error:', error);
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
