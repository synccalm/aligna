import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Icon } from '../../../Navigator/router';

export default function AnimatedIcon({
  name,
  color = "#00B5AD",
  fromSize = 10,
  toSize = 20,
  duration = 300,
}) {
  const sizeAnim = useRef(new Animated.Value(fromSize)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(sizeAnim, {
        toValue: toSize,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // cannot animate "fontSize" with native driver
      }),

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    // Cleanup on unmount
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Icon name={name} size={sizeAnim} color={color} />
    </Animated.View>
  );
}