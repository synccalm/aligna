/**
 * @format
 */

import 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import SplashScreen from './App/Src/Container/SplashScreen/splash-screen';
import { name as appName } from './app.json';
enableScreens();

AppRegistry.registerComponent(appName, () => SplashScreen);
