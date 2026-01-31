/*
 *   File :image selector.jsx
 *   Author URI : https://evoqins.com
 *   Description : image selector modal
 *   Integrations : nil
 *   Version : v1.1
 */
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

import { BlurView } from '@react-native-community/blur';
import { CONSTANTS, Styles } from '../../../Theme';

// Define the type of data object
type ImageSelectProps = {
  show: boolean;
  onSelect: () => void;
  onClose: () => void;
};

const ImageSelectModal: React.FC<ImageSelectProps> = (props: ImageSelectProps) => {
  // Function - handle close
  const _onClose = () => {
    props.onClose();
  };

  // Function - on press
  const _handleOnPress = (option: number) => {
    props.onSelect(option);
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
          blurType="light"
          blurAmount={1}
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

              <View style={[Styles.row, Styles.paddingBottom24]}>
                <TouchableOpacity
                  activeOpacity={CONSTANTS.activeOpacity}
                  onPress={() => _handleOnPress(1)}
                >
                  <View style={[Styles.paddingTop12]}>
                    <Text
                      style={[
                        Styles.fontSize14,
                        Styles.lineHeight20,
                        Styles.rubikSemibold,
                        Styles.colorCynder,
                        Styles.textAlignCenter,
                      ]}
                    >
                      Camera
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={CONSTANTS.activeOpacity}
                  style={[Styles.marginLeft38]}
                  onPress={() => _handleOnPress(2)}
                >
                  <View style={[Styles.paddingTop12]}>
                    <Text
                      style={[
                        Styles.fontSize14,
                        Styles.lineHeight20,
                        Styles.rubikSemibold,
                        Styles.colorCynder,
                        Styles.textAlignCenter,
                      ]}
                    >
                      Gallery
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImageSelectModal;
