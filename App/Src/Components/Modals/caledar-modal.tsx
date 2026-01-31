/*
 *   File : calendar-modal.jsx
 *   Author URI : https://evoqins.com
 *   Description : calendar modal modal
 *   Integrations : react-native-calendar-picker
 *   Version : v1.1
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, TextInput } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

//manual imports
import { COLORS, Styles } from '../../../Theme';
import Icon from '../../../Assets/icon';
import { scaleWidth } from '../../../Helper/responsive';
import { PrimaryButton } from '../Buttons';
import { BlurView } from '@react-native-community/blur';

// Define the type of data object
type CalendarProps = {
  show: boolean;
  initialStartDate?: any;
  initialEndDate?: any;
  selectedDate: any;
  maxDate: any;
  minDate: any;
  initialDate: any;
  onPress: () => void;
  onClose: () => void;
};

const CalendarModal: React.FC<CalendarProps> = (props: CalendarProps) => {
  const calendarRef = useRef<TextInput>(null);
  const firstRun = useRef(true);

  //useState variables
  const [dateSelected, setDateSelected] = useState<string>('');
  const [startDate, setStartDate] = useState<any>(props.initialStartDate || null);
  const [endDate, setEndDate] = useState<any>(props.initialEndDate || null);
  console.log('log', setEndDate, setStartDate);

  // programmatically selecting the date if the selected date is available
  useEffect(() => {
    const date = props.selectedDate;

    if (date && typeof date === 'string' && date.trim().length > 0) {
      // Normalize any format to DD-MM-YYYY
      let parsedDate;

      // Try parsing with moment (handles / and -)
      const m = moment(date, ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], true);
      if (m.isValid()) {
        parsedDate = m.toDate();
      } else {
        // fallback
        parsedDate = new Date(date);
      }

      if (!isNaN(parsedDate.getTime())) {
        setDateSelected(parsedDate);
        if (calendarRef.current?.handleOnPressDay) {
          calendarRef.current.handleOnPressDay(parsedDate);
        }
      }
    } else {
      firstRun.current = false;
    }
  }, [props.selectedDate]);

  // useEffect(() => {
  //   if (props.selectedDate) {
  //     const dateParts = props.selectedDate.split('-');
  //     if (dateParts.length === 3) {
  //       const [dd, mm, yyyy] = dateParts;
  //       const jsDate = new Date(`${yyyy}-${mm}-${dd}`);
  //       setDateSelected(jsDate);
  //     }
  //   }
  // }, [props.selectedDate]);

  console.log('selectedDate:', props.selectedDate);

  // Function - handle close
  const _onClose = () => {
    props.onClose();
  };

  // Function to convert date return in (y/m/d) format
  function _getJsDate(dt) {
    const formatDate = new Date(dt);
    const responseDate = moment(formatDate).format('DD-MM-YYYY');
    return responseDate;
  }

  // Function - on press
  const _handleOnPress = () => {
    if (props.type == 1) {
      props.onPress(_getJsDate(dateSelected));
    } else {
      props.onPress({
        start: formatDate(startDate),
        end: formatDate(endDate),
      });
    }
  };

  // INLINE COMPONENT - previous and next button components
  const NavButtons = ({ type }) => {
    return (
      <View style={[Styles.padding8]}>
        <Icon
          name={'arrow'}
          size={scaleWidth(18)}
          color={COLORS.BLACK}
          style={[type == 1 ? Styles.transForm270 : Styles.transForm90]}
        />
      </View>
    );
  };

  const parseDate = (date: string | Date | undefined) => {
    if (!date) return undefined;
    if (date instanceof Date) return date;
    if (typeof date === 'string') {
      const [dd, mm, yyyy] = date.split('-');
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }
    return undefined;
  };

  const minDateObj = parseDate(props.minDate);
  const maxDateObj = parseDate(props.maxDate) || new Date();

  // custom style for calendar dates
  const customDatesStyles = (date) => {
    const today = moment();
    const isToday = today.isSame(date, 'day');
    const isSelected = moment(dateSelected).isSame(date, 'day');

    return {
      textStyle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: scaleWidth(16),
        color: isToday && !isSelected ? COLORS.PRIMARY : COLORS.GRANITE_GRAY,
      },
    };
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
        <View style={[Styles.flexOne, Styles.alignItemsCenter, Styles.justifyFlexEnd]}>
          <View
            style={[
              Styles.borderWidth2,
              Styles.borderColorWhite,
              Styles.fullWidth,
              Styles.borderTopLeftRadius32,
              Styles.borderTopRightRadius32,
              Styles.backgroundColorPureWhite,
            ]}
          >
            <View style={[]}>
              <CalendarPicker
                selectedStartDate={dateSelected}
                minDate={minDateObj}
                maxDate={maxDateObj}
                // minDate={props.minDate}
                // maxDate={props.maxDate}
                ref={calendarRef}
                initialDate={dateSelected.length == 0 ? props.initialDate : dateSelected}
                todayBackgroundColor="transparent"
                restrictMonthNavigation={false}
                dayLabelsWrapper={{ borderColor: 'transparent' }}
                textStyle={[
                  Styles.rubikSemibold,
                  Styles.fontSize16,
                  Styles.lineHeight18,
                  Styles.colorBlack,
                ]}
                todayTextStyle={[
                  Styles.rubikSemibold,
                  Styles.fontSize16,
                  Styles.lineHeight18,
                  Styles.lineHeight20,
                  Styles.colorBlack,
                ]}
                disabledDatesTextStyle={{
                  color: COLORS.GREY_GOOSE,
                  fontFamily: 'rubik-SemiBold',
                  fontSize: scaleWidth(16),
                }}
                nextComponent={<NavButtons type={1} />} // type 1 for next button
                previousComponent={<NavButtons type={2} />}
                customDatesStyles={customDatesStyles}
                selectedDayStyle={[
                  Styles.backgroundColorPrimary,
                  Styles.height32,
                  Styles.width30,
                  Styles.borderRadius8,
                ]}
                selectedDayTextColor={COLORS.CYNDER}
                customDayHeaderStyles={() => ({
                  style: {}, // optional view wrapper style
                  textStyle: {
                    fontSize: scaleWidth(10),
                    textTransform: 'uppercase',
                    color: '#3B3C3D',
                    letterSpacing: 1.5,
                  },
                })}
                onDateChange={(day) => {
                  if (firstRun.current == false) {
                    setDateSelected(new Date(day));
                  } else {
                    firstRun.current = false;
                  }
                }}
              />
            </View>
            <View
              style={[
                Styles.marginTop16,
                Styles.paddingHorizontal16,
                Styles.marginBottom16,
                Styles.fullWidth,
              ]}
            >
              <PrimaryButton
                type={1}
                loading={false}
                disabled={dateSelected.length == 0 && true}
                card={false}
                label="Confirm date"
                onPress={_handleOnPress}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;
