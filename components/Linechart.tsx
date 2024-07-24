import { Dimensions, ViewStyle } from "react-native";
import { LineChart as Chart } from "react-native-chart-kit";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

interface ChartPoint {
  value: number;
  label: string;
}

interface ChartConfig {
  data: ChartPoint[];
  colors: (opacity: number) => string;
  legend: string[];
  config?: Partial<AbstractChartConfig>;
  style?: Partial<ViewStyle>;
}

const minValue = (minValue: number, value: number) => {
  if (value < minValue) return minValue;
  return value;
};

export default function Linechart({
  data,
  colors,
  legend,
  config,
  style,
}: ChartConfig) {
  return (
    <ScrollView horizontal>
      <Chart
        data={{
          labels: data.map((point) => point.label),
          datasets: [
            {
              data: data.map((point) => point.value),
              color: colors,
              strokeWidth: 2,
            },
          ],
          legend,
        }}
        width={screenWidth * minValue(1, data.length / 4)}
        height={220}
        chartConfig={config}
        style={style}
        bezier
      />
    </ScrollView>
  );
}
