/* File : status-bar.tsx
 * Description : Status bar component
 * Author URI : https://evoqins.com
 * Integrations : NA
 * Version : v1.1
 */

import React, { FC, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

type StatusBarProps = {
  type?: number;
};

const Statusbar: FC<StatusBarProps> = (props: StatusBarProps) => {
  const isFocused = useIsFocused();
  const [type, setType] = useState<number | null>(null);

  useEffect(() => {
    if (props.type) {
      setType(props.type);
    }
  }, [isFocused]);
  if (!isFocused) return null;

  return (
    <StatusBar
      barStyle={type == 1 ? 'dark-content' : 'light-content'}
      backgroundColor={'transparent'}
    />
  );
};

export default Statusbar;
