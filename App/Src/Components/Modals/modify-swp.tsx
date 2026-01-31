/*
 *   File :modify swp.jsx
 *   Author URI : https://evoqins.com
 *   Description : modify swp modal
 *   Integrations : nil
 *   Version : v1.1
 */
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

import { BlurView } from '@react-native-community/blur';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import Icon from '../../../Assets/icon';

// Define the type of data object
type ModifySwpProps = {
  show: boolean;
  type: number;
  onEdit: () => void;
  onClose: () => void;
};

const ModifySwpModal: React.FC<ModifySwpProps> = (props: ModifySwpProps) => {
  // Function - handle close
  const _onClose = () => {
    props.onClose();
  };

  // Function - on press
  const _handleEditSwp = (type: number) => {
    props.onEdit?.(type);
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
                Modify SWP
              </Text>
              <TouchableOpacity
                activeOpacity={CONSTANTS.activeOpacity}
                style={[Styles.rowCenter, Styles.marginTop16, Styles.marginBottom16]}
                onPress={() => _handleEditSwp(1)}
              >
                <Icon
                  name={'edit-without-line'}
                  size={CONSTANTS.Width20}
                  color={COLORS.BLACK}
                  style={[Styles.marginRight8]}
                />
                <Text
                  style={[
                    Styles.fontSize14,
                    Styles.lineHeight20,
                    Styles.colorCynder,
                    Styles.rubikRegular,
                  ]}
                >
                  Edit SWP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={CONSTANTS.activeOpacity}
                style={[Styles.rowCenter, Styles.marginBottom16]}
                onPress={() => _handleEditSwp(2)}
              >
                <Icon
                  name={'pause-circle'}
                  size={CONSTANTS.Width20}
                  color={COLORS.BLACK}
                  style={[Styles.marginRight8]}
                />
                <Text
                  style={[
                    Styles.fontSize14,
                    Styles.lineHeight20,
                    Styles.colorCynder,
                    Styles.rubikRegular,
                  ]}
                >
                  Pause SWP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={CONSTANTS.activeOpacity}
                style={[Styles.rowCenter, Styles.marginBottom16]}
                onPress={() => _handleEditSwp(3)}
              >
                <Icon
                  name={'delete-basket'}
                  size={CONSTANTS.Width20}
                  color={COLORS.BLACK}
                  style={[Styles.marginRight8]}
                />
                <Text
                  style={[
                    Styles.fontSize14,
                    Styles.lineHeight20,
                    Styles.colorCynder,
                    Styles.rubikRegular,
                  ]}
                >
                  Cancel SWP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModifySwpModal;
