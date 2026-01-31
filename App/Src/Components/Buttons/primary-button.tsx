/*
 *   File : primary-button.tsx
 *   Author URI : https://evoqins.com
 *   Description : Primary button
 *   Integrations : null
 *   Version : v1.1
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';

// manual import
import { Styles, CONSTANTS, COLORS } from '../../../Theme';

// Define the type for the data object
type PrimaryButtonProps = {
  type: number;
  is_both: boolean;
  disabled: boolean;
  loading: boolean;
  label: string;
  secLabel: string;
  primaryLabel: string;
  btnStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  onPressSec: () => void;
  height_32?: boolean;
};

const PrimaryButton: React.FC = (props: PrimaryButtonProps) => {
  // constant variable
  const { disabled, loading, height_32, label, onPress, onPressSec, primaryLabel, secLabel } =
    props;

  return props.is_both == true ? (
    <View style={[Styles.rowCenter]}>
      <View
        style={[
          Styles.borderWidth2,
          height_32 ? Styles.height32 : Styles.height48,
          Styles.marginRight6,
          Styles.flexOne,
          Styles.borderColorDarkPrimary,
          props.disabled == true
            ? Styles.backgroundColorWhiteOpacity70
            : Styles.backgroundColorPureWhite,
          Styles.borderRadius24,
        ]}
      >
        <TouchableOpacity
          activeOpacity={CONSTANTS.activeOpacity}
          disabled={disabled || loading}
          onPress={() => onPressSec()}
          style={[
            Styles.center,
            height_32 ? Styles.height32 : Styles.height48,
            { justifyContent: 'center' },
          ]}
        >
          {loading ? (
            <View style={[Styles.height24]}>
              <ActivityIndicator color={COLORS.PURE_WHITE} size={'small'} />
            </View>
          ) : (
            // label for the button
            <Text
              style={[
                Styles.colorDarkPrimary,
                height_32
                  ? [Styles.rubikRegular, Styles.fontSize12, Styles.lineHeight16]
                  : [
                      Styles.rubikSemibold,
                      Styles.fontSize14,
                      Styles.lineHeight16,
                      Styles.paddingTop2,
                    ],
              ]}
            >
              {secLabel}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View
        style={[
          Styles.flexOne,
          height_32 ? Styles.height32 : Styles.height48,
          props.disabled == true
            ? Styles.backgroundColorWildBlueYonder
            : Styles.backgroundColorsDarkPrimary,
          Styles.borderRadius24,
        ]}
      >
        <TouchableOpacity
          activeOpacity={CONSTANTS.activeOpacity}
          disabled={disabled || loading}
          onPress={() => onPress()}
          style={[
            Styles.center,
            height_32 ? Styles.height32 : Styles.height48,
            { justifyContent: 'center' },
          ]}
        >
          {loading ? (
            <View style={[Styles.height24]}>
              <ActivityIndicator color={COLORS.PURE_WHITE} size={'small'} />
            </View>
          ) : (
            // label for the button
            <Text
              style={[
                height_32
                  ? [Styles.fontSize12, Styles.lineHeight16, Styles.rubikRegular]
                  : [
                      Styles.fontSize14,
                      Styles.lineHeight16,
                      Styles.rubikSemibold,
                      Styles.paddingTop2,
                    ],

                Styles.colorPureWhite,
              ]}
            >
              {primaryLabel}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View
      style={[
        props.disabled == true
          ? Styles.backgroundColorWildBlueYonder
          : Styles.backgroundColorsDarkPrimary,
        Styles.height48,
        Styles.borderRadius24,
      ]}
    >
      <TouchableOpacity
        activeOpacity={CONSTANTS.activeOpacity}
        disabled={disabled || loading}
        onPress={() => onPress()}
        style={[Styles.center, Styles.paddingVertical12]}
      >
        {loading ? (
          <View style={[Styles.height16]}>
            <ActivityIndicator color={COLORS.PURE_WHITE} size={'small'} />
          </View>
        ) : (
          // label for the button
          <Text
            style={[
              Styles.rubikSemibold,
              Styles.fontSize14,
              Styles.lineHeight20,
              Styles.colorPureWhite,
              Styles.textAlignCenter,
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PrimaryButton;
