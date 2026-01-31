/*
 *   File :city modal.jsx
 *   Author URI : https://evoqins.com
 *   Description : city modal
 *   Integrations : nil
 *   Version : v1.1
 */
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { BlurView } from '@react-native-community/blur';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import { PrimaryButton } from '../Buttons';
import Icon from '../../../Assets/icon';

// Define the type of data object
type CityModalProps = {
  show: boolean;
  content: string;
  data?: object;
  title?: string;
  selectedId?: number;
  label: string;
  onSelect: () => void;
  onClose: () => void;
};

const CityModal: React.FC<CityModalProps> = (props: CityModalProps) => {
  const [selectedId, setSelectedId] = useState<number>(props.selectedId);

  // Function - handle close
  const _onClose = () => {
    props.onClose();
  };

  // Function - on press
  const _handleSelect = (item: any) => {
    setSelectedId(item.id);
  };

  //Function to handle the primary button
  const _handlePrimaryButton = () => {
    selected_data = props.data.filter((item) => item.id == selectedId);
    props.onSelect(selected_data[0]);
    props.onClose();
  };

  return (
    <Modal
      statusBarTranslucent
      animationType={'fade'}
      transparent={true}
      visible={props.show}
      onRequestClose={() => _onClose()}
    >
      <View style={[Styles.positionAbsolute, Styles.backgroundColorBlack, Styles.justifyFlexEnd]}>
        <BlurView
          style={[Styles.positionAbsolute]}
          blurType="light"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
        <View style={[Styles.flexOne, { maxHeight: '70%' }, Styles.justifyFlexEnd]}>
          <View
            style={[
              Styles.borderWidth2,
              Styles.borderColorWhite,
              Styles.fullWidth,
              Styles.borderTopLeftRadius32,
              Styles.borderTopRightRadius32,
              { maxHeight: '70%' },
              Styles.backgroundColorPureWhite,
            ]}
          >
            <View style={[Styles.padding16]}>
              <View
                style={[
                  Styles.alignSelfCenter,
                  Styles.height1,
                  Styles.backgroundColorWhiteOpacity50,
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
                {props.title}
              </Text>
            </View>

            <FlatList
              data={props.data}
              vertical={true}
              bounces={false}
              overScrollMode={'never'}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, i) => `key-${i}`}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={CONSTANTS.activeOpacity}
                    style={[Styles.rowCenter, Styles.marginBottom14, Styles.paddingHorizontal16]}
                    onPress={() => _handleSelect(item)}
                  >
                    <Icon
                      name={item.id == selectedId ? 'selected-circle' : 'un-selected-circle'}
                      size={CONSTANTS.Width16}
                      color={item.id == selectedId ? COLORS.PRIMARY_COLOR : COLORS.BLACK}
                      style={[Styles.marginRight8]}
                    />
                    <View style={[]}>
                      <Text
                        style={[
                          Styles.fontSize12,
                          Styles.lineHeight24,
                          Styles.rubikRegular,
                          Styles.colorCynder,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <View style={[Styles.paddingHorizontal16, Styles.marginTop24, Styles.marginBottom16]}>
              <PrimaryButton
                disabled={false}
                is_both={false}
                onPress={() => _handlePrimaryButton()}
                label={'Proceed'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CityModal;
