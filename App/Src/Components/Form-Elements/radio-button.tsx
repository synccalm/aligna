/*
 *   File : radio-button.tsx
 *   Author URI : https://evoqins.com
 *   Description : radio button component
 *   Integrations : NA
 *   Version : v1.1
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import Icon from '../../../Assets/icon';

// Define radio props data object
type RadioGroupProps = {
  data: any;
  label: string;
  selectedItem: number;
  isMandatory: boolean;
  onSelectItem: (id: number) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = (props: RadioGroupProps) => {
  // useState variable
  const [data, setData] = useState<any>(props.data);

  // initial set data
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  // handle radio button selection
  function _handleSelection(id: number) {
    props.onSelectItem(id);
  }
  return (
    <View style={[Styles.flexOne]}>
      {props.label && (
        <Text
          style={[
            Styles.rubikRegular,
            Styles.fontSize12,
            Styles.lineHeight16,
            Styles.colorCynder,
            Styles.marginBottom8,
          ]}
        >
          {props.label}
          {props.isMandatory && <Text style={[Styles.colorLavaRed]}> *</Text>}
        </Text>
      )}
      <FlatList
        data={data}
        keyExtractor={(item, index) => `radio-${index}`}
        horizontal={true}
        bounces={false}
        scrollEnabled={false}
        overScrollMode={'never'}
        contentContainerStyle={[Styles.flexOne]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={CONSTANTS.activeOpacity}
              style={[Styles.rowCenter, Styles.marginRight16]}
              onPress={() => {
                _handleSelection(item.id);
              }}
            >
              <Icon
                name={props.selectedItem == item.id ? 'selected-circle' : 'un-selected-circle'}
                size={CONSTANTS.Width20}
                color={props.selectedItem == item.id ? COLORS.PRIMARY_COLOR : COLORS.BLACK}
                style={[Styles.marginRight8]}
              />
              <Text
                style={[
                  Styles.rubikRegular,
                  Styles.fontSize12,
                  Styles.lineHeight24,
                  Styles.colorCynder,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default RadioGroup;
