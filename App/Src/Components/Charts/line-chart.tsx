/* File : line-chart.tsx
 * Description : line chart index file
 * Author URI : https://evoqins.com
 * Integrations : NA
 * Version : v1.2
 */

import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { COLORS, Styles } from '../../../Theme';

type GradientLineChartProps = {
  data: { value: number; label?: string; yName: string; showLabel?: boolean }[];
  height?: number;
  width?: number;
  lineColor?: string;
  pointer_value_clr?: string;
  type?: number;
};

const LineAreaChart: React.FC<GradientLineChartProps> = ({
  data,
  width,
  type,
  lineColor = '#56CCF2',
  pointer_value_clr,
}) => {
  const CHART_HEIGHT = 180;
  const CHART_WIDTH = width || 296;

  const chartPadding = 32;
  const chartWidth = CHART_WIDTH - chartPadding;
  console.log('chartWidth:', chartWidth);

  const spacing = data && data.length > 1 ? CHART_WIDTH / (data.length - 1) : CHART_WIDTH;

  // Format data for chart
  const formattedData = data.map((item) => ({
    value: item.value,
    label: '', // Keep empty for chart itself
    yName: item.yName, // store yName for custom x-axis
  }));

  // Create unique x-axis labels
  const labelCount: Record<string, number> = {};
  const xAxisLabels = data
    .map((item) => {
      if (!item.showLabel) return null;
      const month = item.yName.split(' ')[0];
      labelCount[month] = (labelCount[month] || 0) + 1;
      return labelCount[month] === 2 ? null : month;
    })
    .filter((v) => v !== null);

  return (
    <View>
      <LineChart
        data={formattedData}
        areaChart
        curved
        color={COLORS.PRIMARY_COLOR}
        color2={COLORS.MACARONI}
        startFillColor={lineColor}
        endFillColor="#fff"
        startOpacity={0.15}
        endOpacity={0.02}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        hideRules
        dataPointsColor={COLORS.PRIMARY_COLOR}
        spacing={spacing}
        initialSpacing={0}
        yAxisLabelWidth={0}
        hideXAxisText={type === 2}
        hideYAxisText={type === 2}
        hideDataPoints
        showYAxisIndices={false}
        showXAxisIndices={false}
        rulesColor={COLORS.LIGHT_GREY}
        noOfSections={4}
        xAxisColor="transparent"
        yAxisColor="transparent"
        rulesType="dashed"
        showStripOnFocus
        showDataPointLabelOnFocus
        stripColor="#00CCAA"
        hideDataPoints1
        hideDataPoints2
        onDataPointClick={(item: any, index: any) => {
          console.log('Clicked:', item, index);
        }}
        pointerConfig={{
          pointerStripHeight: 180,
          pointerStripColor: '#1877F2',
          pointerStripWidth: 1,
          pointerRadius: 8,
          pointerBorderWidth: 2,
          pointerBorderColor: 'red',
          pointerColor: COLORS.PRIMARY_COLOR,
          pointerFillColor: COLORS.PURE_WHITE,
          activatePointersOnLongPress: false,
          showPointerStrip: true,
          showPointer: true,
          showPointerInitially: true,
          persistPointer: true,
          initialPointerIndex: 3,
          pointerStripUptoDataPoint: true,

          pointerLabelComponent: (items: any, pointerIndex: number, allData: any) => {
            const [item1] = items;
            if (!item1) return null;

            // Extract month from yName
            const month = item1.yName ? item1.yName.split(' ')[0] : '';

            // Determine horizontal alignment
            const labelStyle: any = {
              position: 'absolute',
              top: -12,
              width: 123,
            };

            if (pointerIndex === 0) {
              // First data point: align right
              labelStyle.right = 0;
            } else if (pointerIndex === allData.length - 1) {
              // Last data point: align left
              labelStyle.left = 0;
            } else {
              // Middle points: center
              labelStyle.left = -24;
            }

            return (
              <View style={labelStyle}>
                <Text
                  style={[
                    Styles.fontSize10,
                    Styles.lineHeight14,
                    Styles.rubikRegular,
                    { color: pointer_value_clr },
                  ]}
                >
                  on 01 {month} 2025 ₹{item1.value}
                </Text>
              </View>
            );
          },
        }}
      />

      {/* X-axis labels */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: CHART_WIDTH,
          marginTop: 8,
        }}
      >
        {xAxisLabels.map((label, index) => (
          <Text
            key={index}
            style={[
              Styles.fontSize10,
              Styles.lineHeight12,
              Styles.rubikRegular,
              Styles.colorCynder,
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default LineAreaChart;
