import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { COLORS, Styles } from '../../../Theme';

type TextInputProps = {
  id: string;
  type: number;
  label: string;
  placeHolder: string;
  isMandatory: boolean;
  value: any;
  focusId: string;
  secureTextEntry: boolean;
  returnKeyType: 'done' | 'go' | 'next' | 'search' | 'send';
  autoCapitalize: 'words' | 'characters' | 'none' | 'sentences';
  autoCompleteType: string;
  autoFocus?: boolean;
  keyboardType: string;
  maxLength?: number;
  error: string;
  prefix: any;
  suffix: any;
  editable?: boolean;
  info?: string;
  multiline?: boolean;
  inputRef?: React.Ref<TextInput>;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  is_otp?: boolean;
};

const CustomTextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  return (
    <View>
      {/* Label */}
      <Text
        style={[
          Styles.rubikRegular,
          Styles.fontSize12,
          Styles.lineHeight16,
          Styles.colorDarkCharcoal,
          Styles.marginBottom4,
        ]}
      >
        {props.label}
        {props.isMandatory && <Text style={[Styles.colorLavaRed]}> *</Text>}
      </Text>

      {/* Input wrapper */}
      <View
        style={[
          props.type === 1
            ? [Styles.height120, Styles.justifyCenter]
            : [Styles.height48, Styles.justifyCenter],
        ]}
      >
        <TextInput
          ref={props.inputRef}
          value={props.value}
          placeholder={props.placeHolder}
          editable={props.editable}
          autoCorrect={false}
          spellCheck={false}
          allowFontScaling={false}
          returnKeyType={props.returnKeyType}
          secureTextEntry={false}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          autoCapitalize={props.autoCapitalize}
          autoFocus={props.autoFocus}
          onChangeText={props.onChangeText}
          onSubmitEditing={props.onSubmitEditing}
          placeholderTextColor={COLORS.GREY_OPACITY_80}
          selectionColor={COLORS.LIGHT_GREY}
          cursorColor={COLORS.PRIMARY_COLOR}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          multiline={props.multiline}
          scrollEnabled={true}
          textAlignVertical={props.multiline ? 'top' : 'center'}
          style={[
            props.type === 1 ? [Styles.height120, Styles.backgroundColorBlack] : Styles.height48,
            Styles.backgroundColorPureWhite,
            Styles.borderRadius12,
            Styles.borderWidth1,
            Styles.borderColorDarkGainsboro,
            Styles.rubikRegular,
            Styles.fontSize16,
            Styles.lineHeight28,
            Styles.colorBlack,
            props.prefix != null ? Styles.paddingLeft24 : Styles.paddingLeft16,
            {
              paddingRight: 16,
              paddingTop: props.multiline ? 12 : 0,
              paddingBottom: props.multiline ? 12 : 0,
            },
          ]}
        />

        {/* Prefix */}
        {props.prefix && (
          <Text
            style={[
              Styles.positionAbsolute,
              Styles.colorDarkCharcoal,
              Styles.fontSize16,
              Styles.lineHeight28,
              Styles.rubikRegular,
              Styles.paddingTop8,
              Styles.paddingBottom20,
              Styles.paddingLeft12,
            ]}
          >
            {props.prefix}
          </Text>
        )}

        {/* Suffix */}
        {props.suffix && (
          <Text
            style={[
              Styles.position,
              Styles.alignSelfFlexEnd,
              Styles.colorDarkCharcoal,
              Styles.marginRight12,
              Styles.fontSize16,
              Styles.lineHeight28,
              Styles.rubikRegular,
            ]}
          >
            {props.suffix}
          </Text>
        )}
      </View>

      {/* Info Text */}
      {props.info && (
        <Text
          style={[
            Styles.fontSize10,
            Styles.lineHeight16,
            Styles.rubikRegular,
            Styles.colorDarkCharcoal,
          ]}
        >
          {props.info}
        </Text>
      )}

      {/* Error Text */}
      {!!props.error && (
        <View style={[Styles.marginTop2]}>
          <Text
            style={[
              Styles.rubikRegular,
              Styles.fontSize12,
              Styles.lineHeight16,
              Styles.colorLavaRed,
            ]}
          >
            {'* '}
            {props.error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CustomTextInput;
