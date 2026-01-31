import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { COLORS, Styles } from '../../../Theme';

// props
type TextInputProps = {
  id: string;
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
  scrollEnabled?: boolean;
  inputRef?: React.Ref<TextInput>;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  is_otp?: boolean;
};

const SliderTextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  return (
    <View
      style={[
        Styles.Width95,
        Styles.rowCenter,
        Styles.borderRadius4,
        Styles.paddingHorizontal6,
        Styles.backgroundColorLavendarLight,
        Styles.height32,
      ]}
    >
      {/* Prefix */}
      {props.prefix && (
        <Text
          style={[
            Styles.fontSize14,
            Styles.lineHeight20,
            Styles.rubikMedium,
            Styles.colorCynder,
            Styles.marginRight4,
          ]}
        >
          {props.prefix}
        </Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} // ensures scroll bar is visible
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={[
            Styles.rubikMedium,
            Styles.fontSize14,
            Styles.lineHeight12,
            Styles.colorBlack,
            { minWidth: 100 }, // ensures width of input
          ]}
          value={props.value}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          placeholder={props.placeHolder}
          scrollEnabled={true} // horizontal scroll
          multiline={false}
          selectionColor={COLORS.LIGHT_GREY}
          cursorColor={COLORS.PRIMARY_COLOR}
          editable={props.editable}
          maxLength={props.maxLength}
        />
      </ScrollView>

      {/* Suffix */}
      {props.suffix && (
        <Text
          style={[
            Styles.fontSize14,
            Styles.lineHeight20,
            Styles.rubikMedium,
            Styles.colorCynder,
            { marginLeft: 6 },
          ]}
        >
          {props.suffix}
        </Text>
      )}
    </View>
  );
};

export default SliderTextInput;
