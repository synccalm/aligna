/*
 *   File : otp-input.js
 *   Author URI : https://evoqins.com
 *   Description : otp input component
 *   Integrations : null
 *   Version : v1.1
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';

// manual imports
import { CONSTANTS, Styles } from '../../../Theme';

// Define the type for component props
type OtpInputProps = {
  error: string;
  label?: string;
  isMandatory?: boolean;
  is_timer?: boolean;
  time?: number;
  autoFocus?: boolean;
  pinInvalid?: boolean;
  onChangeValue: (isValid: boolean, value: string) => void;
  onFocus?: () => void;
};

const OtpInput: React.FC = (props: OtpInputProps) => {
  const inputRef = useRef<TextInput>(null);

  // useState variables
  const [value, setValue] = useState('');
  const [error, setError] = useState(props.error);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //updating error
  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  useEffect(() => {
    if (value.length > 3) {
      props.onChangeValue(true, value);
    } else {
      props.onChangeValue(false, value);
    }
  }, [value]);

  // callback  - clear pin values if pin is invalid
  useEffect(() => {
    if (props.pinInvalid === true) {
      setTimeout(() => {
        value.length = 0;
        setValue('');
      }, 800);
    }
  });

  const _onFocus = () => {
    props?.onFocus();
    inputRef.current?.focus();
  };

  const _focusFields = () => {
    props.inputRef.current.focus();

    if (isKeyboardVisible == false) {
      props.inputRef.current.blur();
      props.inputRef.current.focus();
    }
  };

  return (
    <View style={[]}>
      {props.label && (
        <View style={[]}>
          <Text
            style={[
              Styles.rubikRegular,
              Styles.fontSize12,
              Styles.lineHeight16,
              Styles.colorCynder,
            ]}
          >
            {props.label}
            {props.isMandatory == true && <Text style={[Styles.colorCynder]}>*</Text>}
          </Text>
        </View>
      )}
      <View style={[Styles.rowCenter, Styles.paddingTop12]}>
        <View style={[Styles.row, Styles.justifyFlexStart]}>
          {/* Input one */}
          <TouchableOpacity
            activeOpacity={CONSTANTS.activeOpacity}
            style={[
              Styles.height48,
              Styles.width48,
              Styles.borderRadius12,
              Styles.center,
              Styles.borderWidth1,
              Styles.backgroundColorPureWhite,
              error.length != 0 ? Styles.borderColorLavaRed : Styles.borderColorDarkGainsboro,
            ]}
            onPress={() => _focusFields()}
          >
            {!value.charAt(0) ? (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorGreyOpacity80,
                ]}
              >
                1
              </Text>
            ) : (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                {value.charAt(0)}
              </Text>
            )}
          </TouchableOpacity>

          {/* Input Two */}
          <TouchableOpacity
            activeOpacity={CONSTANTS.activeOpacity}
            style={[
              Styles.height48,
              Styles.width48,
              Styles.borderRadius12,
              Styles.marginLeft12,
              Styles.center,
              Styles.borderWidth1,
              Styles.backgroundColorPureWhite,
              error.length != 0 ? Styles.borderColorLavaRed : Styles.borderColorDarkGainsboro,
            ]}
            onPress={() => _focusFields()}
          >
            {!value.charAt(1) ? (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorGreyOpacity80,
                ]}
              >
                2
              </Text>
            ) : (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                {value.charAt(1)}
              </Text>
            )}
          </TouchableOpacity>

          {/* Input Three */}
          <TouchableOpacity
            activeOpacity={CONSTANTS.activeOpacity}
            style={[
              Styles.height48,
              Styles.width48,
              Styles.borderRadius12,
              Styles.marginLeft12,
              Styles.center,
              Styles.borderWidth1,
              Styles.backgroundColorPureWhite,
              error.length != 0 ? Styles.borderColorLavaRed : Styles.borderColorDarkGainsboro,
            ]}
            onPress={() => _focusFields()}
          >
            {!value.charAt(2) ? (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorGreyOpacity80,
                ]}
              >
                3
              </Text>
            ) : (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                {value.charAt(2)}
              </Text>
            )}
          </TouchableOpacity>

          {/* Input Four */}
          <TouchableOpacity
            activeOpacity={CONSTANTS.activeOpacity}
            style={[
              Styles.height48,
              Styles.width48,
              Styles.borderRadius12,
              Styles.marginLeft12,
              Styles.center,
              Styles.borderWidth1,
              Styles.backgroundColorPureWhite,
              error.length != 0 ? Styles.borderColorLavaRed : Styles.borderColorDarkGainsboro,
            ]}
            onPress={() => _focusFields()}
          >
            {!value.charAt(3) ? (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorGreyOpacity80,
                ]}
              >
                4
              </Text>
            ) : (
              <Text
                style={[
                  Styles.fontSize16,
                  Styles.lineHeight28,
                  Styles.rubikRegular,
                  Styles.colorCynder,
                ]}
              >
                {value.charAt(3)}
              </Text>
            )}
          </TouchableOpacity>

          {/* Text input */}
          <TextInput
            value={value}
            ref={props.inputRef}
            caretHidden={true}
            maxLength={4}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            allowFontScaling={false}
            style={[Styles.width20, Styles.height48, { color: 'transparent' }]}
            autoFocus={props.autoFocus}
            onFocus={() => _onFocus()}
            onChangeText={(val) => setValue(val)}
          />
        </View>

        {props.is_timer == true && (
          <Text
            style={[
              Styles.fontSize12,
              Styles.lineHeight16,
              Styles.rubikRegular,
              Styles.colorIronSideGrey,
              Styles.alignSelfCenter,
            ]}
          >
            00:{props.time}s
          </Text>
        )}
      </View>

      <View style={[Styles.height24]}>
        {props.error.length != 0 && (
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
            {props.error}
          </Text>
        )}
      </View>
    </View>
  );
};

export default OtpInput;
