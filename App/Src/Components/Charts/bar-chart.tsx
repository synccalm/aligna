/* File : bar-chart.tsx
 * Description : bar chart index file
 * Author URI : https://evoqins.com
 * Integrations : NA
 * Version : v1.1
 */

import React, { memo } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Styles } from '../../../Theme';

type BarDatum = {
  data: {
    value: number;
    label?: string;
    frontColor?: string;
  }[];
  width?: number;
  bar_width?: number;
};

function BarAreaChart(props: BarDatum): React.JSX.Element {
  // const barCount = props.data.length;
  // const spacing =
  //   barCount > 1 ? Math.max(0, (props.width - props.bar_width * barCount) / (barCount - 1)) : 0;
  // console.log('props.data', props.data.length);

  return (
    <View style={[Styles.alignItemsCenter]}>
      <BarChart
        data={props.data}
        width={props.width}
        height={173}
        barWidth={props.bar_width}
        // spacing={spacing}
        initialSpacing={0}
        barBorderRadius={12}
        barBorderWidth={2}
        barBorderColor="#FFFFFF"
        hideRules
        hideYAxisText
        hideXAxisLabels
        xAxisThickness={0}
        yAxisThickness={0}
        xAxisLabelTextStyle={[
          Styles.fontSize10,
          Styles.lineHeight16,
          Styles.colorCynder,
          Styles.rubikRegular,
        ]}
        yAxisLabelTextStyle={[
          Styles.fontSize10,
          Styles.lineHeight16,
          Styles.colorCynder,
          Styles.rubikRegular,
        ]}
      />
    </View>
  );
}

export default memo(BarAreaChart);
