import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({
  percentage = 0,
  height = 10,
  backgroundColor = '#E0E0E0',
  fillColor = '#4CAF50',
  borderRadius = 5,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor, borderRadius },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedPercentage}%`,
            backgroundColor: fillColor,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
