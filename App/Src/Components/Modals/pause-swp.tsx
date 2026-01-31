/*
 *   File :pause swp.jsx
 *   Author URI : https://evoqins.com
 *   Description : pause modal
 *   Integrations : nil
 *   Version : v1.1
 */
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

import { BlurView } from '@react-native-community/blur';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import { PrimaryButton } from '../Buttons';
import Icon from '../../../Assets/icon';

// Define the type of data object
type PauseSwpProps = {
  show: boolean;
  content: string;
  // errorToast: any;
  data?: any;
  fromDate: string;
  pauseDate: string;
  type: number;
  btnType: number;
  message: string;
  label: string;
  image_type?: number;
  onEdit: () => void;
  onClose: () => void;
};

const PauseSwpModal: React.FC<PauseSwpProps> = (props: PauseSwpProps) => {
  const [data, setData] = useState<any>([]);
  const [selectedId, setSelectedId] = useState<number>(1);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  // Function - handle close
  const _onClose = () => {
    props.onClose();
  };

  // Function - on press
  const _handlePrimaryButton = () => {
    props.onPress?.();
  };

  const _handleSelectPause = (id: number) => {
    setSelectedId(id);
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
                Pause SWP
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
                  For how many months do you want to pause your SWP?
                </Text>
              </View>

              {data.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={CONSTANTS.activeOpacity}
                    style={[Styles.rowCenter, Styles.marginTop16]}
                    onPress={() => _handleSelectPause(item.id)}
                  >
                    <Icon
                      name={selectedId == item.id ? 'selected-circle' : 'un-selected-circle'}
                      size={CONSTANTS.Width20}
                      color={selectedId == item.id ? COLORS.PRIMARY_COLOR : COLORS.BLACK}
                      style={[Styles.marginRight8]}
                    />
                    <View>
                      <Text
                        style={[
                          Styles.fontSize12,
                          Styles.lineHeight24,
                          Styles.colorCynder,
                          Styles.rubikRegular,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {selectedId == item.id && (
                        <Text
                          style={[
                            Styles.fontSize10,
                            Styles.lineHeight12,
                            Styles.colorCynder,
                            Styles.rubikRegular,
                          ]}
                        >
                          {item.sub_name}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View style={[Styles.paddingTop24]}>
                <PrimaryButton
                  disabled={false}
                  is_both={true}
                  onPressSec={() => _onClose()}
                  onPress={() => _handlePrimaryButton()}
                  secLabel={'Cancel'}
                  primaryLabel={'Pause'}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PauseSwpModal;
