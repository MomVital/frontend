/// <reference types="nativewind/types" />

// Type definitions for react-native-chart-kit
declare module 'react-native-chart-kit' {
  import React from 'react';
  
  export interface LineChartData {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
    legend?: string[];
  }
  
  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    decimalPlaces?: number;
    color?: (opacity: number) => string;
    labelColor?: (opacity: number) => string;
    style?: object;
    propsForDots?: object;
    propsForBackgroundLines?: object;
    propsForLabels?: object;
  }
  
  export interface LineChartProps {
    data: LineChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: object;
    withDots?: boolean;
    withShadow?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    withHorizontalLabels?: boolean;
    withVerticalLabels?: boolean;
    fromZero?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
    yAxisInterval?: number;
    onDataPointClick?: (data: { value: number; dataset: { data: number[] }; getColor: (opacity: number) => string }) => void;
    formatYLabel?: (label: string) => string;
    formatXLabel?: (label: string) => string;
    segments?: number;
    hidePointsAtIndex?: number[];
  }
  
  export class LineChart extends React.Component<LineChartProps> {}
} 