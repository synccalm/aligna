/*
 *   File :bio-metric.jsx
 *   Author URI : https://evoqins.com
 *   Description : bio metric modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { CONSTANTS, Styles, COLORS } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import Icon from '../../../Assets/icon';

// props
type PlanDetailModalProps = {
  show: boolean;
  data: object;
  onClose?: () => void;
};
const PlanDetailModal: React.FC<PlanDetailModalProps> = (props: PlanDetailModalProps) => {
  // handle onClose
  const _onClose = () => {
    props.onClose?.();
  };

  //handle plan detail
  const _handleMorePlanDetail = () => {
    props.onClose?.();
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
            Styles.backgroundColorWhiteSmokeOpacity90,
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
                Styles.rubikMedium,
                Styles.colorCynder,
              ]}
            >
              Continue planing your goal...
            </Text>
            <View
              style={[
                Styles.marginTop16,
                Styles.borderWidth2,
                Styles.borderColorWhite,
                Styles.padding16,
                Styles.backgroundColorWhiteOpacity70,
                Styles.borderRadius16,
                Styles.marginBottom14,
              ]}
            >
              <View style={[Styles.rowCenter]}>
                <Icon
                  name={'circle-tick'}
                  size={CONSTANTS.Width16}
                  color={COLORS.PRIMARY_COLOR}
                  style={[Styles.marginRight4]}
                />
                <Text
                  style={[
                    Styles.fontSize10,
                    Styles.lineHeight14,
                    Styles.rubikRegular,
                    Styles.colorPrimary,
                  ]}
                >
                  Continue investing in your life goals
                </Text>
              </View>

              <FlatList
                data={props.data}
                bounces={false}
                overScrollMode={'never'}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[Styles.marginTop12]}
                keyExtractor={(item, i) => `key-${i}`}
                renderItem={({ item, index }) => {
                  console.log('item:', index);

                  return (
                    <View>
                      <View style={[Styles.row, Styles.spaceBetween, Styles.paddingTop12]}>
                        <View style={[Styles.width132]}>
                          <Text
                            style={[
                              Styles.fontSize12,
                              Styles.lineHeight16,
                              Styles.rubikRegular,
                              Styles.colorCynder,
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={[
                              Styles.fontSize14,
                              Styles.lineHeight20,
                              Styles.rubikMedium,
                              Styles.colorSeaGreen,
                            ]}
                          >
                            {item.amount}
                          </Text>
                        </View>
                        <View style={[Styles.rowCenter]}>
                          <TouchableOpacity
                            activeOpacity={CONSTANTS.activeOpacity}
                            style={[
                              Styles.backgroundColorsDarkPrimary,
                              Styles.paddingHorizontal12,
                              Styles.paddingVertical9,
                              Styles.borderRadius40,
                            ]}
                            onPress={() => _handleMorePlanDetail()}
                          >
                            <Text
                              style={[
                                Styles.fontSize12,
                                Styles.lineHeight14,
                                Styles.rubikRegular,
                                Styles.colorPureWhite,
                              ]}
                            >
                              Plan Details
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={CONSTANTS.activeOpacity}
                            style={[Styles.marginLeft4]}
                            onPress={() => _onClose()}
                          >
                            <Icon
                              name={'close'}
                              size={CONSTANTS.Width24}
                              color={COLORS.DARK_PRIMARY}
                              style={[Styles.marginRight4]}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {item.id - 1 == index && (
                        <View
                          style={[
                            Styles.height1,
                            Styles.backgroundColorPureWhite,
                            Styles.marginTop12,
                          ]}
                        />
                      )}
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PlanDetailModal;
