/*
 *   File :edit-profile-details.jsx
 *   Author URI : https://evoqins.com
 *   Description : edit-profile details
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { CONSTANTS, Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { PrimaryButton } from '../Buttons';
import { CustomTextInput } from '../TextInputs';

// props
type EditProfileDetailsProps = {
  show: boolean;
  type?: string;
  onClose?: () => void;
};

const MARTIAL_STATUS = [
  {
    id: 1,
    name: 'Single',
  },
  {
    id: 2,
    name: 'Married',
  },
];

const EditProfileDetails: React.FC<EditProfileDetailsProps> = (props: EditProfileDetailsProps) => {
  const editValueRef = useRef<TextInput>(null);

  const [editValue, setEditValue] = useState<string>('');
  const [editValueError, setEditValueError] = useState<string>('');

  const [focusId, setFocusId] = useState<string>('');
  const [martialStatusId, setMartialStatusId] = useState<number>(1);

  useEffect(() => {
    setEditValueError('');
  }, [editValue]);

  // Function - handle blur
  const _onBlurAnimation = () => {
    setFocusId('');
  };

  // Function - focus
  const _onFocusAnimation = (val: string) => {
    setFocusId(val);
  };

  // handle onClose
  const _onClose = () => {
    props.onClose?.();
  };

  const _validation = () => {
    const phone_regex = /^[6-9]\d{9}$/gi;

    // const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (props.type == 'email') {
      if (editValue.length == 0) {
        setEditValueError('Email is required');
        editValueRef.current.focus();
        return false;
      }
      //  else if (email_regex.test(editValue) == false) {
      //   setEditValueError('Invalid email');
      //   editValueRef.current.focus();
      //   return false;
      // }
    } else if (props.type == 'mobile_number') {
      if (editValue.length == 0) {
        setEditValueError('Mobile number is required');
        editValueRef.current?.focus();
        return false;
      } else if (editValue.length != 10) {
        setEditValueError('Enter a valid mobile number');
        editValueRef.current?.focus();
        return false;
      } else if (phone_regex.test(editValue) == false) {
        setEditValueError('Enter a valid mobile number');
        editValueRef.current?.focus();
        return false;
      }
    } else {
      return true;
    }
    return true;
  };

  //Function to handle the primary button
  const _handlePrimaryButton = () => {
    console.log('props.type :', props.type);

    const is_valid = _validation();
    console.log('is_valid:', is_valid);

    if (is_valid == true) {
      props.onSubmit(editValue);
    }
  };

  //Function to handle the select option
  const _handleSelect = (item: object) => {
    setMartialStatusId(item.id);
    setEditValue(item.name);
  };
  //Function to handle the cancel button
  const _handleCancel = () => {
    props.onClose();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent
      visible={props.show}
      onRequestClose={_onClose}
    >
      <View style={[Styles.positionAbsolute]}>
        <BlurView
          style={[Styles.positionAbsolute]}
          blurType="light" // "light" | "dark" | "xlight"
          blurAmount={1} // 👈 make this higher (10–25) for visible blur
          reducedTransparencyFallbackColor="white"
        />
      </View>
      <View style={[Styles.flexOne, Styles.alignItemsCenter, Styles.justifyFlexEnd]}>
        <View
          style={[
            Styles.borderWidth2,
            Styles.borderColorWhite,
            Styles.fullWidth,
            Styles.borderTopLeftRadius32,
            Styles.borderTopRightRadius32,
            Styles.backgroundColorPureWhite,
          ]}
        >
          <View style={[Styles.padding16]}>
            <View
              style={[
                Styles.alignSelfCenter,
                Styles.height1,
                Styles.backgroundColorPureWhite,
                Styles.Width72,
                Styles.marginBottom8,
              ]}
            />
            <Text
              style={[
                Styles.fontSize14,
                Styles.lineHeight20,
                Styles.rubikMedium,
                Styles.colorCynder,
              ]}
            >
              {props.type == 'email'
                ? 'What is your email?'
                : props.type == 'mobile_number'
                ? 'What is your mobile number?'
                : 'What is your martial status?'}
            </Text>

            <View style={[Styles.paddingTop16, Styles.marginBottom32]}>
              {props.type == 'martial_status' ? (
                <View style={[Styles.row, Styles.paddingTop8]}>
                  {MARTIAL_STATUS.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={CONSTANTS.activeOpacity}
                        style={[
                          Styles.borderWidth2,
                          Styles.marginRight8,
                          Styles.paddingHorizontal16,
                          Styles.paddingVertical8,
                          Styles.borderRadius32,
                          item.id == martialStatusId
                            ? [
                                Styles.borderColorPrimary,
                                Styles.backgroundColorPrimaryColorOpacity90,
                              ]
                            : [Styles.borderColorWhite, Styles.backgroundColorGreyOpacity10],
                        ]}
                        onPress={() => _handleSelect(item)}
                      >
                        <Text
                          style={[
                            Styles.fontSize14,
                            Styles.lineHeight24,
                            Styles.colorCynder,
                            Styles.rubikRegular,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <CustomTextInput
                  id="editValue"
                  prefix={null}
                  suffix={null}
                  label={`Enter your ${props.type == 'email' ? 'Email id' : 'Mobile number'}`}
                  value={editValue}
                  isMandatory={true}
                  inputRef={editValueRef}
                  error={editValueError}
                  placeHolder={`Enter your ${props.type == 'email' ? 'Email id' : 'Mobile number'}`}
                  editable={true}
                  focusId={focusId}
                  secureTextEntry={false}
                  returnKeyType="done"
                  maxLength={props.type == 'email' ? 50 : 10}
                  keyboardType={props.type != 'mobile_number' ? 'none' : 'number-pad'}
                  autoCapitalize="none"
                  autoFocus={false}
                  onChangeText={(val) => setEditValue(val)}
                  onBlur={() => _onBlurAnimation()}
                  onFocus={() => _onFocusAnimation('editValue')}
                  autoCompleteType="none"
                  onSubmitEditing={() => editValueRef.current?.focus()}
                />
              )}
            </View>

            <View style={[Styles.marginBottom12]}>
              <PrimaryButton
                disabled={false}
                onPress={() => _handlePrimaryButton()}
                label={'Save'}
              />
            </View>

            <TouchableOpacity
              activeOpacity={CONSTANTS.activeOpacity}
              onPress={() => _handleCancel()}
              style={[Styles.marginBottom24]}
            >
              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.rubikMedium,
                  Styles.colorIronSideGrey,
                  Styles.textAlignCenter,
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileDetails;
