import { IChartConfig } from "@/lib/types/IChartConfig";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CurveType } from "recharts/types/shape/Curve";

interface IProps {
  chartConfig: IChartConfig;
  chartData: object[];
  dataKey: string;
  lineType: CurveType;
  showCursor: boolean;
  tooltipText?: string;
}
export default function CustomLineChart(props: IProps) {
  return (
    <ChartContainer config={props.chartConfig}>
      <LineChart
        accessibilityLayer
        data={props.chartData}
        margin={{
          left: 10,
          right: 10,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={props.dataKey}
          tickLine={true}
          axisLine={true}
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis axisLine={true} />
        <ChartTooltip
          formatter={(value, name) => (
            <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
              {props.chartConfig[name as keyof typeof props.chartConfig]
                ?.label || name}
              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                {value}
                <span className="font-normal text-muted-foreground">
                  {props.tooltipText}
                </span>
              </div>
            </div>
          )}
          cursor={props.showCursor}
          content={<ChartTooltipContent hideLabel />}
        />

        {Object.keys(props.chartConfig).map((p, i) => (
          <Line
            key={i}
            dataKey={p}
            type={props.lineType}
            dot={false}
            stroke={props.chartConfig[p].color}
            strokeWidth={2}
            radius={8}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
