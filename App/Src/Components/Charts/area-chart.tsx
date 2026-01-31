/* File : area-chart.tsx
 * Description : area chart index file
 * Author URI : https://evoqins.com
 * Integrations : NA
 * Version : v1.1
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Chart, VerticalAxis, HorizontalAxis, Line, Area } from 'react-native-responsive-linechart';

// manual import
import { Styles, CONSTANTS, COLORS } from '../../../Theme';
// import Images from '../../../Assets/Images';

// Define area chart props data
type AreaChartProps = {
  data: ChartDataPoint;
  loading: boolean;
};
interface ChartDataPoint {
  nav_performance: NavPerformanceItem[];
}

interface NavPerformanceItem {
  createdAt: string;
  current_price: number;
}

export default function AreaChart(props: AreaChartProps): React.JSX.Element {
  // useRef variables
  const lineRef = useRef();

  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const [chartMaxValues, setChartMaxValues] = useState<{
    x: number;
    y: number;
    dateMax: string;
    dateMin: string;
  }>({ x: 0, y: 0, dateMax: '', dateMin: '' });
  const [chartYMinValues, setChartYMinValues] = useState({ yMin: 0, yMax: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const chartData = transformNavPerformance(props?.data);

    // console.log("PERFORMANCE DATA :: ", chartData[chartData.length - 1]?.date);
    // console.log("chartData", chartData)
    const xMax = Math?.max(...chartData.map((d) => d.x));
    const yMax = Math?.max(...chartData.map((d) => d.y));
    const yMin = Math.min(...chartData.map((d) => d.y));
    const dMax = chartData[chartData.length - 1]?.date ?? '';
    const dMin = chartData[0]?.date ?? '';
    const maxValues = { x: xMax + 1, y: yMax, dateMax: dMax, dateMin: dMin };
    // const labels_ = props?.data?.nav_performance?.map(item => item?.createdAt) ?? [];
    // setLabel([...labels_])
    const minValues = { yMin: yMin - 50 < 0 ? 0 : yMin - 50, yMax: yMax + 50 };
    setChartMaxValues(maxValues);
    setChartYMinValues(minValues);
    setData([...chartData]);
    setLoading(props?.loading);

    console.log('DATA :: ', minValues, maxValues);
  }, [props.data, props.loading]);

  function transformNavPerformance(
    navPerformance?: { createdAt: string; current_price: number }[],
  ) {
    if (!Array.isArray(navPerformance)) return [];

    return [...navPerformance].map((item, index) => ({
      x: index,
      y: item?.current_price,
      date: item?.createdAt,
    }));
  }

  //the touching point on the graph
  // const CustomToolTip = useMemo(
  //   () => (tooltip_props: any) => {
  //     if (tooltip_props.position === undefined) {
  //       return;
  //     }

  //     if (!tooltip_props?.position) return null;

  //     const { x, y } = tooltip_props.position;

  //     console.log('heightWidth16:', x, y);

  //     // let selected_index = tooltip_props?.value?.x;
  //     // let nav_date = labels[selected_index];
  //     const nav = tooltip_props?.value?.y;
  //     return (
  //       <View>
  //         <View
  //           style={[
  //             Styles.position,
  //             {
  //               top: tooltip_props.position.y + 5,
  //               left:
  //                 tooltip_props.position.x > CONSTANTS.Width210
  //                   ? tooltip_props.position.x - 170
  //                   : tooltip_props.position.x - 12,
  //             },
  //             { right: 0 },
  //           ]}
  //         >
  //           <Text
  //             style={[
  //               Styles.rubicRegualr,
  //               Styles.fontSize12,
  //               Styles.lineHeight14,
  //               Styles.colorTealishGreen,
  //               { flex: 1 },
  //             ]}
  //             numberOfLines={1}
  //           >
  //             ₹ {nav.toFixed(0)} ({tooltip_props?.value?.date})
  //           </Text>
  //           {/* ({nav_date}) */}
  //         </View>

  //         {/* vertical line */}
  //         <View
  //           style={[
  //             Styles.fullHeight,
  //             Styles.width1,
  //             Styles.backgroundColorMidGreen,
  //             Styles.borderWidth2,
  //             { borderStyle: 'dashed', left: tooltip_props.position.x, height: '100%' },
  //           ]}
  //         />

  //         {/* tool tip image */}
  //         <Image
  //           source={Images.graph_point}
  //           style={[
  //             Styles.heightWidth16,
  //             Styles.position,
  //             { top: tooltip_props.position.y + 22, left: tooltip_props.position.x - +7 },
  //           ]}
  //         />
  //       </View>
  //     );
  //   },
  //   [],
  // );

  return (
    <View>
      {loading ? (
        <View style={[Styles.center, Styles.flexOne, { height: 230 }]}>
          <ActivityIndicator color={COLORS.PRIMARY_COLOR} size={'small'} />
        </View>
      ) : (
        <View>
          {data.length > 0 && chartMaxValues.y > 0 && (
            <Chart
              data={data}
              style={[Styles.height200]}
              xDomain={{ min: 0, max: chartMaxValues?.x }}
              yDomain={{ min: chartYMinValues?.yMin, max: chartYMinValues?.yMax }}
              padding={{
                left: 0,
                top: (30 / CONSTANTS.Height) * 720,
                bottom: (1 / CONSTANTS.Height) * 720,
                right: 0,
              }}
              disableGestures={false}
            >
              <VerticalAxis
                tickCount={5}
                theme={{
                  axis: {
                    stroke: { width: 0 },
                  },
                  labels: { visible: false },
                  ticks: { visible: false },
                  grid: {
                    stroke: { color: COLORS.WHITE_OPACITY_5, width: 1 },
                  },
                }}
              />

              <HorizontalAxis
                tickCount={7}
                theme={{
                  axis: {
                    stroke: { width: 0 },
                  },
                  labels: { visible: false },
                  ticks: { visible: false },
                  grid: {
                    stroke: { width: 0, dashArray: [5] },
                  },
                }}
              />

              <Area
                theme={{
                  gradient: {
                    from: { color: '#3D8A54', opacity: 0.4 },
                    to: { color: '#3D8A54', opacity: 0.1 },
                  },
                }}
              />

              <Line
                data={data}
                // smoothing={'cubic-spline'}
                ref={lineRef}
                theme={{
                  stroke: { color: COLORS.SEA_GREEN, width: 2 },
                  labels: { visible: false },
                  ticks: { visible: false },
                }}
                initialTooltipIndex={data.length - 1}
                // tooltipComponent={<CustomToolTip type={2} /> }
              />
            </Chart>
          )}
          <View style={[Styles.row, Styles.spaceBetween, { height: 30 }, Styles.paddingTop10]}>
            <Text
              style={[
                Styles.rubicRegualr,
                Styles.fontSize12,
                Styles.lineHeight14,
                Styles.colorTealishGreen,
              ]}
            >
              {chartMaxValues.dateMin}
            </Text>
            <Text
              style={[
                Styles.rubicRegualr,
                Styles.fontSize12,
                Styles.lineHeight14,
                Styles.colorTealishGreen,
              ]}
            >
              {chartMaxValues.dateMax}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
