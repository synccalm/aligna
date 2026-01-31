/*
 *   File : tab-element.tsx
 *   Author URI : https://evoqins.com
 *   Description : bottom tab bar element
 *   Integrations : Null
 *   Version : v1.1
 */

import React from 'react';
import { View, Text } from 'react-native';

// manual import
import { COLORS, CONSTANTS, Styles } from '../../Theme';
import { Icon } from '../router';

// icon data
const ICONS = ['cloud', 'moon-stars', 'target-arrow', 'more'];
const ICONS1 = ['cloud1', 'moon-stars1', 'target-arrow1', 'colored-goal'];

const UNSELECTED_ICONS = ['un-selected-home', 'mf', 'more', 'portfolio', 'mf-loan'];

// labels data
const LABELS = ['Sync-Calm•', 'Grow•', 'Board•', 'More•'];

// Define tab element props data object
type TabElementProps = {
  index: number;
  isFocused: boolean;
};

export default function TabElement(props: TabElementProps): React.JSX.Element {
  return (
    <View style={[Styles.Width72, Styles.center, Styles.marginTop18, { height: 76 }]}>
      {/* icon */}
      <View style= {{height: 40,  justifyContent: 'flex-end'}}>
        <Icon
          name={
            props.isFocused 
              ? ICONS1[props.index]
              : ICONS[props.index]
          }
          style= {{marginLeft: props.index == 1? 20 : 0}}
          size={props.index == 1? 40: props.index == 3 ? 20 : CONSTANTS.Width24}
          color={props.isFocused ? COLORS.TEAL : COLORS.CHARCOL}
        />
      </View>

      {/* name */}
      <View style={[Styles.marginTop2]}>
        <Text
          style={[
            Styles.rubicRegualr,
            Styles.fontSize10,
            Styles.lineHeight16,
            props.isFocused ? {color: COLORS.TEAL} : {color: COLORS.CHARCOL},
          ]}
        >
          {LABELS[props.index]}
        </Text>
      </View>
    </View>
  );
}
