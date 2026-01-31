/*
 *   File :create-mandate.jsx
 *   Author URI : https://evoqins.com
 *   Description : create-mandate modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { CustomTextInput } from '../TextInputs';
import { myEdges } from '../../../Helper/type-models';
import { PrimaryButton } from '../Buttons';
import { _formatToRupees } from '../../../Helper/converter';
import { OrderSuccessModal, OtpInputTextModal } from '../Modals';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// props
type CreateMandateProps = {
  show: boolean;
  title?: string;
  sub_title?: string;
  content?: string;
  type?: number;
  label?: string;
  onClose?: () => void;
};

// define types
type RootStackParamList = Record<string, undefined>;

// define navigation type
type Screen0NavProp = StackNavigationProp<RootStackParamList>;

const CreateMandate: React.FC<CreateMandateProps> = () => {
  // navigation declarations
  const navigation = useNavigation<Screen0NavProp>();

  const mandateAmountRef = useRef<TextInput>(null);

  const [focusId, setFocusId] = useState<string>('');
  const [mandateAmount, setMandateAmount] = useState<string>('');
  const [mandateAmountError, setMandateAmountError] = useState<string>('');
  const [OtpInputTextStatus, setOtpInputTextStatus] = useState<boolean>(false);
  const [successModalStatus, setSuccessModalStatus] = useState<boolean>(false);

  useEffect(() => {
    setMandateAmountError('');
  }, [mandateAmount]);

  // Function - handle blur
  const _onBlurAnimation = () => {
    setFocusId('');
  };

  // Function - focus
  const _onFocusAnimation = (val: string) => {
    setFocusId(val);
  };

  // handle onClose
  const _validate = () => {
    if (mandateAmount.length == 0) {
      setMandateAmountError('Please enter the value');
      return false;
    }
    return true;
  };

  //Function to handle the next
  const _onConfirm = () => {
    const is_valid = _validate();
    if (is_valid == true) {
      setOtpInputTextStatus(true);
    }
  };

  //Function to handle the success otp modal
  const _handleSuccessOtpModal = () => {
    setOtpInputTextStatus(false);
    setSuccessModalStatus(true);
  };

  //Function to handle the success modal
  const _handleSuccessModal = () => {
    setSuccessModalStatus(false);
    navigation.popToTop();
  };
  return (
    <View
      style={[Styles.flexGrowOne, Styles.backgroundColorWhiteOpacity10, Styles.justifyFlexEnd]}
      edges={myEdges}
    >
      <BlurView
        style={[Styles.positionAbsolute]}
        blurType="light"
        blurAmount={1}
        reducedTransparencyFallbackColor="white"
      />
      <View style={[{ maxHeight: '65%' }, Styles.backgroundColorWhiteOpacity10]}>
        <View
          style={[
            Styles.borderWidth1,
            Styles.borderColorWhite,
            Styles.borderRadius32,
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
              Create Mandate
            </Text>

            <View style={[Styles.marginBottom42]}>
              <CustomTextInput
                id="mandate_amount"
                prefix={'₹'}
                suffix={'Max: 50Cr'}
                label="Enter mandate amount upto"
                value={mandateAmount ? _formatToRupees(mandateAmount) : ''}
                inputRef={mandateAmountRef}
                error={mandateAmountError}
                placeHolder="50,00,000"
                editable={true}
                focusId={focusId}
                secureTextEntry={false}
                returnKeyType="done"
                maxLength={12}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoFocus={false}
                onChangeText={(val) => setMandateAmount(val)}
                onBlur={() => _onBlurAnimation()}
                onFocus={() => _onFocusAnimation('mandateAmount')}
                autoCompleteType="none"
                onSubmitEditing={() => mandateAmountRef.current?.focus()}
              />
            </View>

            <View style={[Styles.marginBottom12, Styles.paddingTop16]}>
              <PrimaryButton
                disabled={false}
                is_both={false}
                onPress={() => _onConfirm()}
                label={'Continue'}
              />
            </View>
          </View>
        </View>
      </View>
      {OtpInputTextStatus && (
        <OtpInputTextModal
          button_label={'Verify'}
          show={OtpInputTextStatus}
          onClose={() => setOtpInputTextStatus(false)}
          onSubmit={() => _handleSuccessOtpModal()}
        />
      )}

      {successModalStatus && (
        <OrderSuccessModal
          show={successModalStatus}
          btnType={1}
          image_type={1}
          content={'Mandate Created Successfully'}
          message={'You can now enable auto-debit for your transactions seamlessly.'}
          label="Ok"
          onClose={() => setSuccessModalStatus(false)}
          onPress={() => _handleSuccessModal()}
        />
      )}
    </View>
  );
};

export default CreateMandate;
