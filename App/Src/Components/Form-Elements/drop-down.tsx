/* File : drop-down.tsx
 * Description : Drop down component
 * Author URI : https://evoqins.com
 * Integrations : NA
 * Version : v1.1
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// manual import
import { Styles, COLORS, CONSTANTS } from '../../../Theme';
import Icon from '../../../Assets/icon';
import { CityModal } from '../Modals';

// Define custom input props object types
type DropDownProps = {
  data: any;
  type: string;
  placeHolder: string;
  label: string;
  error: string;
  selectedId?: number;
  selectedName?: string;
  isDisabled: boolean;
  loader: boolean;
  isMandatory: boolean;
  onPress?: () => void;
};

const CustomDropDown: React.FC<DropDownProps> = (props: DropDownProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [countryId, setCountryId] = useState<number>(null);
  const [cityId, setCityId] = useState<number>(null);

  const [relationShipId, setRelationShipId] = useState<number>(null);
  const [identityId, setIdentityId] = useState<number>(null);
  const [financialId, setFinancialId] = useState<number>(null);

  useEffect(() => {
    if (props.type == 'city') {
      setCityId(props.selectedId);
    }
    if (props.type == 'country') {
      setCountryId(props.selectedId);
    }
    if (props.type == 'relationship') {
      setRelationShipId(props.selectedId);
    }
    if (props.type == 'id') {
      setIdentityId(props.selectedId);
    }
    if (props.type == 'financial') {
      setFinancialId(props.selectedId);
    }
  }, [props.selectedId]);

  // handle dropdown modal
  const _handleOpenModal = (status: boolean) => {
    setShowModal(status);
    if (props.updateModalStatus != undefined) {
      props.updateModalStatus(status);
    }
  };

  // handle close modal
  const _closeModal = (status) => {
    setShowModal(status);
  };

  // handle dropdown
  const _handleDropdowns = (data: object) => {
    props.onSelect(data);
  };

  return (
    <View>
      <Text
        style={[
          Styles.rubikRegular,
          Styles.fontSize12,
          Styles.lineHeight16,
          Styles.colorDarkCharcoal,
          Styles.marginBottom4,
        ]}
      >
        {props.label}
        {props.isMandatory && <Text style={[Styles.colorLavaRed]}> *</Text>}
      </Text>
      <View style={[Styles.height48, Styles.justifyCenter]}>
        <TouchableOpacity
          activeOpacity={CONSTANTS.activeOpacity}
          style={[
            Styles.rowCenter,
            Styles.spaceBetween,
            Styles.flexOne,
            Styles.height48,
            Styles.backgroundColorPureWhite,
            Styles.borderRadius12,
            Styles.borderWidth2,
            Styles.borderColorDarkGainsboro,
            Styles.rubikRegular,
            Styles.fontSize16,
            Styles.lineHeight28,
            Styles.colorBlack,
            Styles.paddingLeft16,
          ]}
          onPress={() => _handleOpenModal(true)}
        >
          <Text
            style={[
              Styles.fontSize16,
              Styles.lineHeight28,
              Styles.rubikRegular,
              props.selectedName != '' ? Styles.colorCynder : Styles.colorGreyOpacity80,
            ]}
          >
            {props.selectedName != '' ? props.selectedName : props.placeHolder}
          </Text>
          <Icon
            name={'arrow'}
            size={CONSTANTS.Width16}
            color={COLORS.BLACK}
            style={[Styles.marginRight16]}
          />

          {showModal == true &&
            (props.type == 'city' ? (
              <CityModal
                show={showModal}
                data={props.data}
                title={'Select city'}
                selectedId={cityId}
                onClose={() => _closeModal(false)}
                onSelect={_handleDropdowns}
              />
            ) : props.type == 'relationship' ? (
              <CityModal
                show={showModal}
                data={props.data}
                title={'Select Relationship'}
                selectedId={relationShipId}
                onClose={() => _closeModal(false)}
                onSelect={_handleDropdowns}
              />
            ) : props.type == 'id' ? (
              <CityModal
                show={showModal}
                data={props.data}
                title={'Select Identity'}
                selectedId={identityId}
                onClose={() => _closeModal(false)}
                onSelect={_handleDropdowns}
              />
            ) : props.type == 'financial' ? (
              <CityModal
                show={showModal}
                data={props.data}
                title={'Select financial year'}
                selectedId={financialId}
                onClose={() => _closeModal(false)}
                onSelect={_handleDropdowns}
              />
            ) : (
              <CityModal
                show={showModal}
                data={props.data}
                title={'Select Country'}
                selectedId={countryId}
                onClose={() => _closeModal(false)}
                onSelect={_handleDropdowns}
              />
            ))}
        </TouchableOpacity>
      </View>
      {/* Error Text */}
      {!!props.error && (
        <View style={[Styles.marginTop2]}>
          <Text
            style={[
              Styles.rubikRegular,
              Styles.fontSize12,
              Styles.lineHeight16,
              Styles.colorLavaRed,
            ]}
          >
            {'* '}
            {props.error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CustomDropDown;
