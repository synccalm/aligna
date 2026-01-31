/* File : circle-chart.tsx
 * Description : circle chart index file
 * Author URI : https://evoqins.com
 * Integrations : NA
 * Version : v1.1
 */
import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Styles } from '../../../Theme';

// Define props type
type CircleChartProps = {
  data: { value: number; color: string; text?: string }[];
};

const CircleChart: React.FC<CircleChartProps> = ({ data }) => {
  return (
    <View style={[Styles.flexOne, Styles.justifyCenter, Styles.alignItemsCenter]}>
      <PieChart
        data={data}
        strokeCap="round"
        isRound={true}
        donut
        textColor="#000"
        radius={50}
        innerRadius={30}
      />
    </View>
  );
};

export default CircleChart;
