/*
 *   File : search-input.js
 *   Author URI : https://evoqins.com
 *   Description : search input component
 *   Integrations : null
 *   Version : v1.1
 */
import React, { useRef } from 'react';
import { View, TextInputProps, Text, TextInput, TouchableOpacity } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import Icon from '../../../Assets/icon';

// search input props data object
type SearchInputProp = {
  type: number;
  editable: boolean;
  autoFocus: boolean;
  onPressItem: (value: string) => void;
  onPressSearchFundScreen?: boolean;
  onPressFilter: number;
  placeholder?: string;
  placeholderTextColor?: string;
};

const SearchInput: React.FC<SearchInputProp> = (props: SearchInputProp) => {
  // useRef variable
  const searchRef = useRef<any>('');

  //Function to navigate to search fund screen
  const _handleSearchFundScreen = () => {
    props.onPressSearchFundScreen();
  };

  // Function - clearing input
  const _handleFilter = () => {
    props.onPressFilter('');
  };

  // Function - handle text change
  const _handleText = (value: string) => {
    searchRef.current = value;
    props.onPressItem(value);
  };

  const RenderTextInput = React.useCallback(
    (_: TextInputProps) => (
      <View
        style={[
          Styles.rowCenter,
          Styles.height40,
          props.type == 2 ? [Styles.width190] : Styles.flexOne,
        ]}
      >
        <Icon
          name={'search'}
          size={CONSTANTS.Width17}
          color={COLORS.CYNDER}
          style={[Styles.marginRight4]}
        />

        <View style={[Styles.rowSpaceCenter, Styles.flexOne]}>
          {props.editable == true ? (
            <TextInput
              value={searchRef.current}
              placeholder={props.placeholder}
              style={[
                Styles.flexOne,
                Styles.height40,
                Styles.rubikRegular,
                Styles.fontSize14,
                Styles.lineHeight24,
                Styles.colorBlack,
                Styles.paddingVertical10,
                Styles.marginTop1,
                Styles.marginTop2,
              ]}
              ref={searchRef}
              placeholderTextColor={props.placeholderTextColor}
              selectionColor={COLORS.LAVENDER}
              returnKeyType="done"
              cursorColor={COLORS.LAVENDER}
              autoFocus={props.autoFocus}
              onChangeText={(val) => {
                _handleText(val);
              }}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={CONSTANTS.activeOpacity}
              onPress={() => _handleSearchFundScreen()}
            >
              <Text
                style={[
                  Styles.rubikRegular,
                  Styles.fontSize14,
                  Styles.lineHeight24,
                  Styles.colorDimGray,
                ]}
              >
                Search Here “Large Cap Funds
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {props.type == 1 && (
          <TouchableOpacity activeOpacity={CONSTANTS.activeOpacity} onPress={() => _handleFilter()}>
            <Icon
              name={'filter'}
              size={CONSTANTS.Width17}
              color={COLORS.CYNDER}
              style={[Styles.marginRight4]}
            />
          </TouchableOpacity>
        )}
      </View>
    ),
    [],
  );

  return (
    <View
      style={[
        props.type == 2 ? [Styles.width190] : Styles.flexOne,
        Styles.backgroundColorWhiteOpacity70,
        Styles.borderRadius12,
      ]}
    >
      <Autocomplete
        data={[]}
        hideResults={true}
        value={searchRef.current}
        autoFocus={props.autoFocus}
        editable={props.editable}
        style={[Styles.height40]}
        selectionColor={COLORS.GREY}
        inputContainerStyle={[
          Styles.rowSpaceCenter,
          Styles.height40,
          Styles.paddingVertical10,
          Styles.paddingHorizontal12,
          Styles.borderRadius12,
          Styles.borderWidth1,
          Styles.borderColorWhite,
        ]}
        listContainerStyle={[Styles.center]}
        onChangeText={(val) => console.log('this is ::=>', val)}
        renderTextInput={RenderTextInput}
      />
    </View>
  );
};

export default SearchInput;
