import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type GradientSwitchProps = {
  value?: boolean; // controlled value
  onValueChange?: (val: boolean) => void; // callback when toggled
  width?: number; // switch width
  height?: number; // switch height
  knobSize?: number; // knob size
  activeColor?: string; // gradient active color
  inactiveColor?: string; // background inactive color
  style?: ViewStyle; // custom wrapper style
};

const GradientSwitch: React.FC<GradientSwitchProps> = ({
  value,
  onValueChange,
  width = 36,
  height = 20,
  knobSize = 16,
  activeColor = '#2563EB',
  inactiveColor = 'white',
  style,
}) => {
  const [internalValue, setInternalValue] = useState(false);
  const isEnabled = value !== undefined ? value : internalValue;

  const toggle = () => {
    const newVal = !isEnabled;
    if (value === undefined) setInternalValue(newVal); // uncontrolled
    onValueChange?.(newVal);
  };

  return (
    <View style={style}>
      <LinearGradient
        colors={isEnabled ? [activeColor, activeColor] : [inactiveColor, inactiveColor]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0.5, y: 0 }}
        style={[styles.container, { width, height, borderRadius: height / 2 }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggle}
          style={[styles.touchArea, { width, height, padding: 2 }]}
        >
          <View
            style={[
              {
                width: knobSize,
                height: knobSize,
                borderRadius: knobSize / 2,
                backgroundColor: isEnabled ? 'white' : activeColor,
                alignSelf: isEnabled ? 'flex-end' : 'flex-start',
              },
            ]}
          />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  touchArea: {
    justifyContent: 'center',
  },
});

export default GradientSwitch;
