/*
 *   File :skip sip.jsx
 *   Author URI : https://evoqins.com
 *   Description : skip sip modal
 *   Integrations : nil
 *   Version : v1.1
 */
import { View, Text, Modal } from 'react-native';

import { BlurView } from '@react-native-community/blur';
import { Styles } from '../../../Theme';
import { PrimaryButton } from '../Buttons';

// Define the type of data object
type SkipSipProps = {
  show: boolean;
  onEdit: () => void;
  onClose: () => void;
};

const SkipSipModal: React.FC<SkipSipProps> = (props: SkipSipProps) => {
  // Function - handle close
  const _onClose = () => {
    props.onClose();
  };

  // Function - on press
  const _handleCancel = () => {
    props.onPress?.();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType={'fade'}
      transparent={true}
      visible={props.show}
      onRequestClose={() => _onClose()}
    >
      <View style={[Styles.positionAbsolute]}>
        <BlurView
          style={[Styles.positionAbsolute]}
          blurType="light" // "light" | "dark" | "xlight"
          blurAmount={1} // 👈 make this higher (10–25) for visible blur
          reducedTransparencyFallbackColor="white"
        />
        <View style={[Styles.flexOne, Styles.alignItemsCenter, Styles.justifyFlexEnd]}>
          <View
            style={[
              Styles.borderWidth2,
              Styles.borderColorWhite,
              Styles.fullWidth,
              Styles.borderTopLeftRadius12,
              Styles.borderTopRightRadius12,
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
                  Styles.marginBottom16,
                ]}
              />

              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.colorCynder,
                  Styles.rubikMedium,
                ]}
              >
                Are you sure you want to skip 01 Sept 2025 SIP instalment?
              </Text>

              <View style={[Styles.marginTop8, Styles.marginBottom16]}>
                <Text
                  style={[
                    Styles.fontSize14,
                    Styles.lineHeight20,
                    Styles.colorCynder,
                    Styles.rubikRegular,
                  ]}
                >
                  Your next due date will be 01 Oct 2025
                </Text>
              </View>

              <View style={[Styles.paddingTop24]}>
                <PrimaryButton
                  disabled={false}
                  is_both={true}
                  onPressSec={() => _handleCancel()}
                  onPress={() => _onClose()}
                  secLabel={'No, cancel'}
                  primaryLabel={'Yes, skip'}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SkipSipModal;
