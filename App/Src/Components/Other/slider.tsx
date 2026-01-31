/* File : slider.tsx
 * Description : slider component
 * Author URI : https://evoqins.com
 * Integrations : @ptomasroos/react-native-multi-slider
 * Version : v1.1
 */

import React from 'react';
import { View, Image } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Styles } from '../../../Theme';
import Images from '../../../Assets/Images';

type MySliderProps = {
  value: number;
  onValueChange: (val: number) => void;
  onValueVaries?: (val: number) => void;
  min: number;
  max: number;
  slider_height: number;
  slider_width: number;
  type: number;
  step: number;
};

const SliderComponent: React.FC<MySliderProps> = ({
  value,
  onValueChange,
  onValueVaries,
  min,
  max,
  slider_height,
  slider_width,
  type,
  step,
}) => {
  const SLIDER_WIDTH = slider_width;

  const _handleSliderFinish = (values: number[]) => {
    onValueChange(values[0]);
  };

  const _handleOnChange = (values: number[]) => {
    if (onValueVaries) {
      onValueVaries(values[0]);
    }
  };

  return (
    <View style={[type == 1 && Styles.marginLeft12, { width: SLIDER_WIDTH }]}>
      <MultiSlider
        values={[value]}
        min={min}
        max={max}
        step={step}
        sliderLength={SLIDER_WIDTH}
        selectedStyle={[Styles.backgroundColorPrimary, { height: slider_height }]}
        unselectedStyle={[
          type == 1
            ? Styles.backgroundColorPureWhite
            : type == 2
            ? Styles.backgroundColorLightLavendar
            : Styles.backgroundColorGreyOpacity_20,
          { height: slider_height },
        ]}
        onValuesChangeFinish={_handleSliderFinish}
        onValuesChange={_handleOnChange}
        customMarker={() =>
          type == 1 ? (
            <Image
              source={Images.slider_pointer}
              style={[Styles.height20, Styles.width20, { resizeMode: 'contain' }]}
            />
          ) : type == 2 ? (
            <Image
              source={Images.slider_pointer_oval}
              style={[
                Styles.height22,
                Styles.width28,
                Styles.paddingTop8,
                { resizeMode: 'contain' },
              ]}
            />
          ) : (
            <Image
              source={Images.white_oval_pointer}
              style={[
                Styles.height22,
                Styles.width36,
                Styles.paddingTop8,
                { resizeMode: 'contain' },
              ]}
            />
          )
        }
        trackStyle={[Styles.borderRadius16]}
      />
    </View>
  );
};

export default SliderComponent;
