/*
 *   File :fund-filters.jsx
 *   Author URI : https://evoqins.com
 *   Description : fund filters modal
 *   Integrations : nil
 *   Version : v1.1
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';

import { BlurView } from '@react-native-community/blur';
import { PrimaryButton } from '../Buttons';
import Icon from '../../../Assets/icon';
import { SearchInput } from '../TextInputs';

interface SubFilter {
  id: number;
  name: string;
}

interface FilterOption {
  id: number;
  name: string;
  equity_types?: SubFilter[];
  debt_type?: SubFilter[];
  hybird_type?: SubFilter[]; // preserved from your original naming
}

type FilterGroup = {
  id: number;
  key: keyof SelectedFilters; // 👈 added
  title: string;
  filters: FilterOption[];
};

type SelectedFilters = {
  sort?: number | null;
  category?: number | null;
  risk?: number | null;
  amc?: number | null;
  subFilter?: number | null;
};

type FundFiltersProps = {
  show: boolean;
  filters: FilterGroup[];
  onClose: () => void;
  onSubmit: (selectedFilters: SelectedFilters) => void;
};

const FundFiltersModal: React.FC<FundFiltersProps> = (props: FundFiltersProps) => {
  const [activeGroup, setActiveGroup] = useState<FilterGroup>(
    props.filters?.[0] ?? { id: 0, title: '', filters: [] },
  );

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    sort: null,
    category: null,
    risk: null,
    amc: null,
    subFilter: null,
  });

  useEffect(() => {
    if (props.selectedFilters) {
      setSelectedFilters(props.selectedFilters);
    } else {
      setSelectedFilters({
        sort: null,
        category: null,
        risk: null,
        amc: null,
        subFilter: null,
      });
    }
  }, [props.selectedFilters, props.show]);

  // handle onClose
  const _onClose = () => {
    props.onClose?.();
  };

  //Function to clear all the filters
  const _handleClearAll = () => {
    setSelectedFilters({
      sort: null,
      category: null,
      risk: null,
      amc: null,
      subFilter: null,
    });
  };

  //Function to handle the selected filters
  const _handleSelectedFilter = (filterId: number, group: FilterGroup) => {
    const key = group.key;
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key] === filterId ? null : filterId,
    }));
  };

  const _handleSubFilter = (subId: number) => {
    setSelectedFilters((prev) => ({
      ...prev,
      subFilter: prev.subFilter === subId ? null : subId,
    }));
  };

  //Function to handle the primary button
  const _handlePrimaryButton = () => {
    props.onSubmit(selectedFilters);
    props.onClose?.();
  };

  const renderSubFilters = (item: FilterOption) => {
    const subItems: SubFilter[] = item.equity_types || item.debt_type || item.hybird_type || [];

    if (!subItems.length) return null;

    return (
      <View style={[Styles.marginLeft40]}>
        {subItems.map((sub) => {
          const isSelected = selectedFilters.subFilter === sub.id;
          return (
            <TouchableOpacity
              key={sub.id}
              activeOpacity={CONSTANTS.activeOpacity}
              style={[Styles.rowCenter, Styles.paddingVertical8]}
              onPress={() => _handleSubFilter(sub.id)}
            >
              <Icon
                name={isSelected ? 'selected-square-2' : 'unselect-square'}
                size={CONSTANTS.Width20}
                color={isSelected ? COLORS.PRIMARY_COLOR : COLORS.BLACK}
                style={[Styles.marginRight4]}
              />
              <Text
                style={[
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.rubikRegular,
                  isSelected ? Styles.colorPrimary : Styles.colorCynder,
                ]}
              >
                {sub.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent
      visible={props.show}
      onRequestClose={_onClose}
    >
      <View style={[Styles.flexOne, Styles.backgroundColorWhiteOpacity10, Styles.justifyFlexEnd]}>
        <BlurView
          style={[Styles.positionAbsolute]}
          blurType="light" // "light" | "dark" | "xlight"
          blurAmount={1} // 👈 make this higher (10–25) for visible blur
          reducedTransparencyFallbackColor="white"
        />
      </View>
      <View style={[Styles.backgroundColorPureWhite, { maxHeight: '60%' }, Styles.justifyFlexEnd]}>
        <View
          style={[
            Styles.borderWidth2,
            Styles.borderColorWhite,
            Styles.fullWidth,
            Styles.borderTopLeftRadius32,
            Styles.borderTopRightRadius32,
            Styles.backgroundColorPureWhite,
            Styles.maxHeight70,
            Styles.justifyFlexEnd,
          ]}
        >
          <View style={[Styles.padding16]}>
            <View
              style={[
                Styles.alignSelfCenter,
                Styles.height1,
                Styles.backgroundColorLightishSilver,
                Styles.Width72,
                Styles.marginBottom8,
              ]}
            />
            <View style={[Styles.rowCenter, Styles.spaceBetween]}>
              <Text
                style={[
                  Styles.fontSize14,
                  Styles.lineHeight20,
                  Styles.rubikMedium,
                  Styles.colorCynder,
                ]}
              >
                Filters
              </Text>
              <TouchableOpacity
                activeOpacity={CONSTANTS.activeOpacity}
                onPress={() => _handleClearAll()}
              >
                <Text
                  style={[
                    Styles.rubikRegular,
                    Styles.fontSize12,
                    Styles.lineHeight16,
                    Styles.colorPrimary,
                    Styles.dottedUnderlinePrimary,
                  ]}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                Styles.height1,
                Styles.backgroundColorLightSilver,
                Styles.marginTop16,
                Styles.marginHorizontalMinus16,
              ]}
            />
            <View style={[Styles.row]}>
              <View style={[Styles.width132, Styles.marginLeftMinus16]}>
                <FlatList
                  data={props.filters}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    const isActive = item.id === activeGroup.id;
                    return (
                      <TouchableOpacity
                        activeOpacity={CONSTANTS.activeOpacity}
                        style={[
                          Styles.paddingHorizontal16,
                          Styles.paddingVertical16,
                          isActive && Styles.backgroundColorPrimaryOpacity30,
                        ]}
                        onPress={() => setActiveGroup(item)}
                      >
                        <Text
                          style={[
                            Styles.fontSize14,
                            Styles.lineHeight24,
                            Styles.rubikRegular,
                            isActive ? Styles.colorPrimary : Styles.colorCynder,
                          ]}
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <View
                style={[Styles.flexGrowOne, Styles.width1, Styles.backgroundColorLightSilver]}
              />

              <View style={[Styles.width220]}>
                {activeGroup.title == 'AMC' && (
                  <View style={[Styles.marginBottom32, Styles.marginTop16]}>
                    <SearchInput
                      placeholder={'Search Here'}
                      placeholderTextColor={'#B5B5B7'}
                      type={2}
                      editable={true}
                      autoFocus={false}
                      onPressItem={(val: string) => {
                        const filtered = activeGroup.filters.filter((f) =>
                          f.name.toLowerCase().includes(val.toLowerCase()),
                        );
                        setActiveGroup({ ...activeGroup, filters: filtered });
                      }}
                    />
                  </View>
                )}

                <FlatList
                  data={activeGroup.filters}
                  showsVerticalScrollIndicator={false}
                  style={[Styles.marginBottom100]}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    const isSelected = selectedFilters[activeGroup.key] === item.id;
                    console.log('item,,', item);
                    return (
                      <View>
                        <TouchableOpacity
                          activeOpacity={CONSTANTS.activeOpacity}
                          style={[
                            Styles.paddingHorizontal16,
                            Styles.paddingVertical16,
                            Styles.rowCenter,
                            Styles.spaceBetween,
                          ]}
                          // onPress={() => setSelectedFilter(item, activeGroup)}
                          onPress={() => _handleSelectedFilter(item.id, activeGroup)}
                        >
                          <View style={[Styles.rowCenter]}>
                            {activeGroup.title == 'Sort by' ? (
                              <Icon
                                name={isSelected ? 'selected-circle' : 'un-selected-circle'}
                                size={CONSTANTS.Width20}
                                color={isSelected ? COLORS.PRIMARY_COLOR : COLORS.BLACK}
                                style={[Styles.marginRight4]}
                              />
                            ) : (
                              <Icon
                                name={isSelected ? 'selected-square-2' : 'unselect-square'}
                                size={CONSTANTS.Width20}
                                color={isSelected ? COLORS.PRIMARY_COLOR : COLORS.BLACK}
                                style={[Styles.marginRight4]}
                              />
                            )}
                            <Text
                              style={[
                                Styles.fontSize14,
                                Styles.lineHeight24,
                                Styles.rubikRegular,
                                Styles.colorCynder,
                              ]}
                            >
                              {item.name}
                            </Text>
                          </View>

                          <View style={[]}>
                            {activeGroup.title == 'Categories' && (
                              <Icon
                                name={'arrow'}
                                size={CONSTANTS.Width12}
                                color={COLORS.BLACK}
                                style={[
                                  Styles.marginLeft4,
                                  isSelected && renderSubFilters(item) && Styles.transForm180,
                                ]}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                        {/* Show SubFilters if exist and selected */}
                        {isSelected && renderSubFilters(item)}
                      </View>
                    );
                  }}
                />
              </View>
            </View>

            <View
              style={[
                Styles.height1,
                Styles.marginHorizontalMinus16,
                Styles.backgroundColorPureWhite,
              ]}
            />
          </View>
        </View>

        <View style={[Styles.padding16, Styles.backgroundColorPureWhite]}>
          <PrimaryButton
            disabled={false}
            is_both={false}
            onPress={() => _handlePrimaryButton()}
            label={'Apply'}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FundFiltersModal;
