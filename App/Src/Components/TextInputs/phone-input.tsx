/*
 *   File : phone-input.js
 *   Author URI : https://evoqins.com
 *   Description : phone input component
 *   Integrations : null
 *   Version : v1.1
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

// manual imports
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import Images from '../../../Assets/Images';

// Define the type for the data object
type PhoneTextInputProps = {
  value: string;
  label: string;
  isMandatory: boolean;
  editable: boolean;
  error: string;
  placeholder: string;
  inputRef: React.RefObject<TextInput>; // Corrected type for inputRef
  onChangeValue: (newValue: string) => void;
  onPressIcon: () => void;
};

export default function PhoneTextInput(props: PhoneTextInputProps): JSX.Element {
  // constant variable
  const { label, isMandatory, editable, error, placeholder, inputRef, onChangeValue, onPressIcon } =
    props;

  // useState variables
  const [value, setValue] = useState<string>(props.value ? props.value : '');

  useEffect(() => {
    onChangeValue(value);
  }, [value]);

  return (
    <View>
      {label && (
        // phone input label
        <View style={[]}>
          <Text
            style={[
              Styles.rubikRegular,
              Styles.fontSize12,
              Styles.lineHeight16,
              Styles.colorCynder,
            ]}
          >
            {label}
            {isMandatory == true && <Text style={[Styles.colorCynder]}>*</Text>}
          </Text>
        </View>
      )}

      {/* phone input */}

      <View style={[Styles.rowCenter, Styles.paddingTop12]}>
        <View
          style={[
            Styles.backgroundColorPureWhite,
            Styles.marginRight12,
            Styles.paddingHorizontal10,
            Styles.paddingVertical10,
            Styles.borderRadius12,
            Styles.rowCenter,
            Styles.borderWidth1,
            Styles.borderColorDarkGainsboro,
          ]}
        >
          <Image
            source={Images.india_flag}
            style={[Styles.height24, Styles.width24, Styles.marginRight8]}
          />
          <Text
            style={[
              Styles.fontSize16,
              Styles.lineHeight22,
              Styles.colorDarkCharcoal,
              Styles.rubikRegular,
            ]}
          >
            +91
          </Text>
        </View>
        <View
          style={[
            Styles.paddingLeft8,
            Styles.backgroundColorPureWhite,
            Styles.width234,
            Styles.borderRadius12,
            Styles.height48,
            Styles.borderWidth1,
            error.length != 0 ? Styles.borderColorLavaRed : Styles.borderColorDarkGainsboro,
          ]}
        >
          <TouchableOpacity
            activeOpacity={CONSTANTS.activeOpacity}
            disabled={editable == true}
            onPress={() => (onPressIcon ? onPressIcon() : null)}
          >
            <TextInput
              value={value}
              style={[
                Styles.alignItemsCenter,
                Styles.rubikRegular,
                Styles.fontSize16,
                Styles.lineHeight28,
                Styles.colorDarkCharcoal,
                Styles.height48,
              ]}
              ref={inputRef}
              maxLength={10}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              cursorColor={COLORS.DIM_GRAY}
              placeholder={placeholder}
              //placeholderTextColor={COLORS.DIM_GRAY}
              placeholderTextColor={COLORS.GREY_OPACITY_80}
              // placeholderTextColor={'rgba(108, 108, 108, 1)'}
              autoFocus={false}
              onChangeText={(val) => setValue(val)}
            />
          </TouchableOpacity>
          {/* input error message */}
          <View style={[Styles.height24]}>
            {error.length != 0 && (
              <Text
                style={[
                  Styles.rubikRegular,
                  Styles.fontSize10,
                  Styles.lineHeight14,
                  Styles.colorLavaRed,
                ]}
                numberOfLines={1}
              >
                {'* '}
                {error}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default PhoneTextInput;
