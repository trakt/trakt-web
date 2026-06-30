/**
 * The atomic unit of every value-over-category visualization: a single
 * labelled value. Bar, line, area, sparkline and distribution primitives all
 * speak `VizPoint[]`, so a dataset is interchangeable across them - swap a
 * `<BarChart>` for a `<LineChart>` without reshaping the data.
 */
export type VizPoint = {
  value: number;
  label: string;
};
