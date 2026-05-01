type BarChartData = {
  value: number;
  label: string;
};

type TooltipArgs = { value: number; label: string; index: number };

export type BarChartProps = {
  data: BarChartData[];
  tooltipHTML?: (args: TooltipArgs) => string;
};
