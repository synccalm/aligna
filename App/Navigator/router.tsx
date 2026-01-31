import React, { useEffect } from 'react';
import { LogBox, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast, { BaseToast } from 'react-native-toast-message';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import OneSignal from 'react-native-onesignal';

// navigation import
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { AppState } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Introduction, Test } from '../Src/Container/Introduction';
import { SetPin, Signup, VerifyOtp, VerifyPin } from '../Src/Container/Auth';
import { COLORS, CONSTANTS, Styles } from '../Theme';
import TabElement from './Tabs/tab-element';
import { BlurView } from '@react-native-community/blur';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../Assets/Icomoon/selection.json';
import { Store } from '../Store';
import { Home } from '../Src/Container/Home';


import { CreateMandate } from '../Src/Components/Other';
import Grow from '../Src/Container/Grow/grow';
import { Board } from '../Src/Container/Board';
import Affirmation from '../Src/Container/Home/affirmation';
import Wishlist from '../Src/Container/Home/wishlist';
import CreateWishlist from '../Src/Container/Home/create-wishlist';
import MoneyTracker from '../Src/Container/Home/money-tracker';
import MeditationLanding from '../Src/Container/Meditation/meditation-landing';
import DailyPlanner from '../Src/Container/Home/daily-planner';
import SleepLanding from '../Src/Container/Sleep/sleep-landing';
import WishlistDetails from '../Src/Container/Home/wishlist-details';
import { SetupPin, SetupBiometrics, UnlockScreen } from '../Src/Container/Unlock';
import { StorageHelper } from '../Helper/storage';
import JournalList from '../Src/Container/Journal/journal-list';
import CreateJournal from '../Src/Container/Journal/create-journal';
import JournalDetail from '../Src/Container/Journal/journal-detail';
import TossCoin from '../Src/Container/TossCoin';
import Visualization from '../Src/Container/Visualization';
import { Text } from 'react-native';
// Actually router is in /App/Navigator. Storage is in /App/Helper.
// Correct path: '../Helper/storage'

export const Icon = createIconSetFromIcoMoon(icoMoonConfig);

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

Text.defaultProps = { allowFontScaling: false };

export const ToastConfig: {
  success: (props: any) => JSX.Element;
  failure: (props: any) => JSX.Element;
} = {
  success: (props: any) => (
    <View style={[Styles.row, Styles.backgroundColorWhite, Styles.borderRadius8, Styles.margin16]}>
      <BaseToast
        {...props}
        style={[
          Styles.borderLeftColorGreen,
          Styles.fullWidth,
          Styles.fullHeight,
          Styles.row,
          Styles.paddingVertical16,
        ]}
        contentContainerStyle={[Styles.paddingHorizontal8]}
        text1Style={[
          Styles.fontSize14,
          Styles.robotoMedium,
          Styles.lineHeight19,
          Styles.colorBlack,
        ]}
        text1NumberOfLines={10}
        // renderLeadingIcon={() =>
        //     <View style={[Styles.justifyCenter, Styles.paddingLeft8]}>
        //         <Icon name={'success'}
        //             size={CONSTANTS.Width24}
        //             color={COLORS.WARNING_TEXT_GREEN} />
        //     </View>
        // }
        renderTrailingIcon={() => (
          <View style={[Styles.alignItemsFlexEnd, Styles.paddingRight16, Styles.center]}>
            <Icon
              name={'close'}
              size={CONSTANTS.Width24}
              style={[Styles.opacity80]}
              color={COLORS.RAISIN_BLACK}
            />
          </View>
        )}
      />
    </View>
  ),

  failure: (props: any) => (
    <View style={[Styles.row, Styles.backgroundColorWhite, Styles.borderRadius8, Styles.margin16]}>
      <BaseToast
        {...props}
        style={[
          Styles.borderLeftClolorRed,
          Styles.fullWidth,
          Styles.fullHeight,
          Styles.row,
          Styles.paddingVertical16,
        ]}
        contentContainerStyle={[Styles.paddingHorizontal8]}
        text1Style={[
          Styles.fontSize14,
          Styles.robotoMedium,
          Styles.lineHeight19,
          Styles.colorBlack,
        ]}
        text1NumberOfLines={10}
        renderTrailingIcon={() => (
          <View style={[Styles.alignItemsFlexEnd, Styles.paddingRight16, Styles.center]}>
            <Icon
              name={'close'}
              size={CONSTANTS.Width24}
              style={[Styles.opacity80]}
              color={COLORS.BLACK}
            />
          </View>
        )}
      />
    </View>
  ),
};

// INLINE - bottom tab component
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          height: 76,
          backgroundColor: 'transparent',
          borderTopColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopLeftRadius: CONSTANTS.Width12,
          borderTopRightRadius: CONSTANTS.Width12,
          overflow: 'hidden',
          position: 'absolute',
        },

        tabBarBackground: () => (
          <BlurView
            style={[Styles.fullHeight, Styles.fullWidth]}
            blurType="light"
            blurAmount={3.5}
          />
        ),
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={() => ({
          tabBarIcon: ({ focused }) => <TabElement index={0} isFocused={focused} />,
        })}
      />
      <Tab.Screen
        name="mf"
        component={Grow}
        options={() => ({
          tabBarIcon: ({ focused }) => <TabElement index={1} isFocused={focused} />,
        })}
      />
      <Tab.Screen
        name="board"
        component={Board}
        options={() => ({
          tabBarIcon: ({ focused }) => <TabElement index={2} isFocused={focused} />,
        })}
      />
      <Tab.Screen
        name="Store"
        component={Test}
        options={() => ({
          tabBarIcon: ({ focused }) => <TabElement index={3} isFocused={focused} />,
        })}
      />
    </Tab.Navigator>
  );
}

interface AuthContextProps {
  logIn: () => void;
  signIn: () => void;
}

export const AuthContext = React.createContext<AuthContextProps | null>();

// INLINE COMPONENT - Sign up
function SignUpStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="signup"
        component={Signup}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-otp"
        component={VerifyOtp}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-pin"
        component={VerifyPin}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="set-pin"
        component={SetPin}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// INLINE - onboard stack
function IntroductionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="onboarding"
        component={Introduction}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function SignInStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="tabs"
        component={Tabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="affirmation"
        component={Affirmation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="create-wishlist"
        component={CreateWishlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="money-tracker"
        component={MoneyTracker}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="meditation-landing"
        component={MeditationLanding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="daily-planner"
        component={DailyPlanner}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sleep-landing"
        component={SleepLanding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="wishlist-details"
        component={WishlistDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="setup-pin" component={SetupPin} options={{ headerShown: false }} />
      <Stack.Screen name="setup-biometrics" component={SetupBiometrics} options={{ headerShown: false }} />
      <Stack.Screen name="unlock-screen" component={UnlockScreen} options={{ headerShown: false, gestureEnabled: false }} />

      {/* Dream Journal Screens */}
      <Stack.Screen name="journal-list" component={JournalList} options={{ headerShown: false }} />
      <Stack.Screen name="create-journal" component={CreateJournal} options={{ headerShown: false }} />
      <Stack.Screen name="journal-detail" component={JournalDetail} options={{ headerShown: false }} />

      {/* Toss Coin */}
      <Stack.Screen name="toss-coin" component={TossCoin} options={{ headerShown: false }} />

      {/* Visualization */}
      <Stack.Screen name="visualization" component={Visualization} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const App: React.FC = () => {
  const navigationRef = useNavigationContainerRef(); // Create ref logic here

  useEffect(() => {
    // Suppress all warnings (use with caution)
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  // --- Auto Lock Logic ---
  const [appState, setAppState] = React.useState(AppState.currentState);
  console.log("Current AppState Loop:", appState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      console.log(`[App] AppState change: ${appState} -> ${nextAppState}`);
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log("[App] App coming to foreground. Initiating Auth Check...");

        try {
          console.log("[App] Calling StorageHelper.getAuthSettings()...");

          // Race against a timeout to detect hangs
          const settingsPromise = StorageHelper.getAuthSettings();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Auth Check Validation Timeout")), 5000));

          const settings = await Promise.race([settingsPromise, timeoutPromise]) as any;

          console.log("[App] Auth Settings Retrieved:", JSON.stringify(settings));

          if (settings && settings.hasAuthSetup) {
            console.log("[App] Auth setup detected. Checking navigation readiness...");
            if (navigationRef.isReady()) {
              console.log("[App] Navigation Ready. Navigating to unlock-screen...");
              navigationRef.navigate('unlock-screen' as never);
            } else {
              console.error("[App] Navigation Not Ready. Cannot show unlock screen.");
            }
          } else {
            console.log("[App] No Auth Setup found (hasAuthSetup is false or undefined).");
          }
        } catch (error) {
          console.error("[App] Critical functionality error during Auto-Lock check:", error);
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);
  // -----------------------

  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isUpdation: false,
            isLoading: false,
            appInstallationStatus: action.appInstallationStatus,
            unlock: false,
          };
        case 'UNLOCK':
          return {
            ...prevState,
            userToken: action.token,
            isUpdation: false,
            isLoading: false,
            appInstallationStatus: true,
            unlock: action.unlock,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
            isUpdation: false,
            isLoading: false,
            appInstallationStatus: true,
            unlock: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
            isLoading: false,
            isUpdation: false,
            appInstallationStatus: true,
            unlock: action.unlock,
          };
        case 'UPDATION':
          return {
            ...prevState,
            userToken: null,
            isLoading: false,
            isUpdation: true,
            loadingCompleted: true,
            appInstallationStatus: true,
            unlock: false,
          };
      }
    },
    {
      isLoading: true,
      isUpdation: false,
      userToken: null,
      appInstallationStatus: false,
      unlock: false,
    },
  );

  useEffect(() => {
    Orientation.lockToPortrait(); // device orientation lock
    const bootstrapAsync = async () => {
      let user_token = null;
      let app_installation_status = null;
      try {
        app_installation_status = await EncryptedStorage.getItem('@NEW_USER');
        if (app_installation_status == null) {
          dispatch({ type: 'RESTORE_TOKEN', appInstallationStatus: null });
        } else {
          user_token = await EncryptedStorage.getItem('@REFRESH_TOKEN');
          console.log('user_token |', user_token);

          if (user_token != null) {
            // await Store.dispatch({ type: 'UPDATE_REFRESH_TOK', payload: user_token });
            dispatch({ type: 'UNLOCK', unlock: true, token: user_token });
          } else {
            dispatch({ type: 'SIGN_OUT', token: null, unlock: true });
          }
        }
      } catch (error) {
        console.log('Encrypted Storage Error :: ', error);
      }
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      unlock: async () => {
        const refresh_token = await EncryptedStorage.getItem('@REFRESH_TOKEN');
        console.log('refresh_token |', refresh_token);

        dispatch({ type: 'UNLOCK', unlock: true, token: refresh_token });
      },
      signIn: async () => {
        console.log('signed in');

        const auth_token = await Store.getState().Reducer.ACCESS_TOKEN;
        dispatch({ type: 'SIGN_IN', token: auth_token });
      },
      signOut: async () => {
        try {
          await EncryptedStorage.removeItem('@REFRESH_TOKEN');
          await EncryptedStorage.removeItem('@BIOMETRIC_KEY');
          dispatch({ type: 'SIGN_OUT', token: null, unlock: true });
        } catch (error) {
          console.log('error:', error);

          console.log('error occur to clear EncryptedStorage');
        }
      },
    }),
    [],
  );
  // Function - clear all
  async function _clearAll(): Promise<void> {
    try {
      // Clear Store and Async storage
    } catch (error) {
      console.log('error occur to clear EncryptedStorage and redux', error);
    }
  }



  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer ref={navigationRef}>
          {/* {state.isLoading == false &&
            (state.appInstallationStatus == null ? (
              <IntroductionStack />
            ) : state.unlock == true ? (
              state.userToken == null ? (
                <SignUpStack />
              ) : (
                <SignInStack />
              )
            ) : (
              <SignInStack />
            ))} */}
          <SignInStack />
        </NavigationContainer>

        <Toast
          position="bottom"
          config={ToastConfig}
          autoHide={true}
          onPress={() => Toast.hide()}
        />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
};
export default App;
