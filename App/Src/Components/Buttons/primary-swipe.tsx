import React, { FC } from 'react';
import { View, StyleSheet, TextStyle, ViewStyle, Image } from 'react-native';
import SwipeButton from 'rn-swipe-button';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import Images from '../../../Assets/Images';
import { Styles } from '../../../Theme';

interface SwipeButtonPrimaryProps {
  onSwipe: () => void;
  title?: string;
}

const SwipeButtonPrimary: FC<SwipeButtonPrimaryProps> = ({
  onSwipe,
  title = 'Take risk profile',
}) => {
  return (
    <View style={[styles.wrapper]}>
      <SwipeButton
        containerStyles={styles.container as ViewStyle}
        railBackgroundColor={'rgba(255, 255, 255, 0.43)'}
        railBorderColor="white"
        railFillBackgroundColor="white"
        railFillBorderColor="white"
        thumbIconBackgroundColor="white"
        thumbIconBorderColor="white"
        thumbIconComponent={() => (
          <View style={styles.thumb}>
            <Icon name="arrow" size={20} color="#000" />
          </View>
        )}
        title={title}
        titleStyles={styles.title as TextStyle}
        onSwipeSuccess={onSwipe}
        shouldResetAfterSuccess={true}
      />

      {/* trailing icons */}
      <View style={styles.trailingIcons}>
        <Image
          source={Images.arrow_group}
          resizeMode="contain"
          style={[Styles.Width46, Styles.height16, Styles.minusOneZindex]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: scaleWidth(328),
    height: scaleWidth(64),
  },
  container: {
    borderRadius: scaleWidth(50),
    overflow: 'hidden',
    padding: scaleWidth(8),
  },
  thumb: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    borderRadius: scaleWidth(24),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    transform: [{ rotate: '270deg' }],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  trailingIcons: {
    position: 'absolute',
    right: scaleWidth(20),
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(4),
    zIndex: 0,
  },
});

export default SwipeButtonPrimary;
