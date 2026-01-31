/*
 *   File : header-tab.tsx
 *   Author URI : https://evoqins.com
 *   Description : header tab component
 *   Integrations : null
 *   Version : v1.1
 */

import React, { useRef } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from '../../../Assets/icon';

//manual import
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import Images from '../../../Assets/Images';

// Define custom tab data object
type HeaderTabProp = {
  type: number;
  title: string;
  navigationEnabled?: boolean;
  screen_name: string;
};

// Define the parameter types for each screen in the stack
type RootStackParamList = {
  list: undefined;
};

// Define the navigation prop type
type NavigationType = StackNavigationProp<RootStackParamList>;

const HeaderTab: React.FC<HeaderTabProp> = (props: HeaderTabProp) => {
  // navigation declarations
  const navigation = useNavigation<NavigationType>();

  // useRef variable
  const backButtonRef = useRef(false);

  // handing go back
  const _goBack = () => {
    if (props.navigationEnabled == true) {
      navigation.goBack();
    }
  };
  return (
    <View style={[Styles.rowSpaceCenter]}>
      {props.navigationEnabled == true && (
        <View style={[Styles.justifyFlexStart, Styles.rowCenter]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={_goBack}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            disabled={backButtonRef.current}
            style={[props.screen_name != null && Styles.marginRight8]}
          >
            <Icon name={'arrow-left'} size={CONSTANTS.Width24} color={COLORS.BLACK} />
          </TouchableOpacity>

          {props.screen_name != null && (
            <Text
              style={[
                Styles.fontSize14,
                Styles.lineHeight20,
                Styles.rubikRegular,
                Styles.colorCynder,
              ]}
            >
              {props.screen_name}
            </Text>
          )}
        </View>
      )}

      {props.icon == true && (
        <View style={[]}>
          <Image
            source={Images.logo_with_name}
            style={[
              props.type == 1
                ? [Styles.height24, Styles.width118]
                : [Styles.height38, Styles.width190],
            ]}
          />
        </View>
      )}

      <View />
    </View>
  );
};
export default HeaderTab;
