import type { SliderRange } from './SliderRange.ts';

type Ticks = {
  count?: number;
  formatter?: (value: number) => string;
};

export type SliderProps = {
  range: SliderRange;
  value: SliderRange;
  step?: number;
  ticks?: Ticks;
  onChange: (range: SliderRange) => void;
  onCommit?: (range: SliderRange) => void;
  disabled?: boolean;
};
