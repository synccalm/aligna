/*
 *   File : date-picker.js
 *   Author URI : https://evoqins.com
 *   Description : date picker component
 *   Integrations : null
 *   Version : v1.1
 */
import React, { useEffect, useState } from 'react';
import { View, Text, Keyboard, TouchableOpacity } from 'react-native';
import { COLORS, CONSTANTS, Styles } from '../../../Theme';
import moment from 'moment';
import Icon from '../../../Assets/icon';
import { CalendarModal } from '../Modals';

// Define radio props data object
type datePickerProps = {
  label: string;
  error: string;
  isMandatory: boolean;
  value: string;
  maxDate: any;
  minDate: any;
  defaultDate: any;
  disabled: boolean;
  onConfirm: (data: any) => void;
};

const CustomDatePicker: React.FC<datePickerProps> = (props: datePickerProps) => {
  // useState variables
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [maxDate, setMaxDate] = useState<Date>(props.maxDate);
  const [minDate, setMinDate] = useState<string>(props.minDate);
  const [defaultDates, setDefaultDates] = useState<string>(props.defaultDate);
  const [selectedDate, setSelectedDate] = useState<string>(props.value);

  // set min and max date
  useEffect(() => {
    if (props.maxDate) {
      setMaxDate(props.maxDate);
    }
    if (props.minDate) {
      setMinDate(props.minDate);
    }
  }, [props.maxDate, props.minDate]);

  // set selected date
  useEffect(() => {
    setSelectedDate(props.value);
  }, [props.value]);

  // set default date
  useEffect(() => {
    setDefaultDates(props.defaultDate);
  }, [props.defaultDate]);

  // Function - handling open calendar
  const _openCalendar = (status: boolean) => {
    Keyboard.dismiss();
    setCalendarVisible(status);
  };

  // Function - handling close calendar
  const _closeCalendar = () => {
    setCalendarVisible(false);
  };

  // Function - handling confirm date
  const _confirmDate = (data: any) => {
    props.onConfirm(data);
    setCalendarVisible(false);
  };

  return (
    <View style={[]}>
      {/* label */}
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
      <View
        style={[
          // Styles.flexOne,
          Styles.height48,
          Styles.justifyCenter,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={props.disabled}
          onPress={() => _openCalendar(true)}
        >
          <View
            style={[
              Styles.height48,
              Styles.backgroundColorPureWhite,
              Styles.borderRadius12,
              Styles.borderWidth1,
              Styles.borderColorDarkGainsboro,
              Styles.rowSpaceCenter,
              Styles.paddingRight16,
            ]}
          >
            <Text
              style={[
                Styles.rubikRegular,
                Styles.fontSize16,
                Styles.lineHeight28,
                Styles.paddingLeft12,
                [selectedDate ? Styles.colorCynder : Styles.colorGreyOpacity80],
              ]}
            >
              {' '}
              {selectedDate
                ? moment(selectedDate, 'DD-MM-YYYY').format('DD/MM/YYYY')
                : 'DD/MM/YYYY'}
            </Text>
            <Icon name="calendar-square" size={CONSTANTS.Width16} color={COLORS.CYNDER} />
          </View>
        </TouchableOpacity>
      </View>

      {/* text input error */}
      {(props.error && props.error.length) != 0 && (
        <View style={[Styles.marginTop2]}>
          <Text
            style={[
              Styles.rubikRegular,
              Styles.fontSize12,
              Styles.lineHeight16,
              Styles.colorLavaRed,
            ]}
            numberOfLines={1}
          >
            {'*'}
            {props.error}
          </Text>
        </View>
      )}

      {calendarVisible && (
        <CalendarModal
          show={calendarVisible}
          type={1}
          selectedDate={selectedDate}
          initialDate={defaultDates ? defaultDates : maxDate}
          maxDate={maxDate}
          minDate={minDate}
          onClose={_closeCalendar}
          onPress={(date: any) => _confirmDate(date)}
        />
      )}
    </View>
  );
};

export default CustomDatePicker;
