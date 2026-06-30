import type { Snippet } from 'svelte';

export type BubbleChartItem = {
  id: number;
  label: string;
  value: number;
  imageUrl?: string | null;
  color: string;
};

export type BubbleChartTooltipArgs = {
  item: BubbleChartItem;
};

export type BubbleChartProps = {
  items: BubbleChartItem[];
  tooltip?: Snippet<[BubbleChartTooltipArgs]>;
  /** Accessible chart summary; rendered as a screen-reader figcaption. */
  label?: string;
};
