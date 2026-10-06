import type { SliderRange } from './models/SliderRange.ts';

type IsFullRangeProps = {
  value: SliderRange;
  range: SliderRange;
};

export function isFullRange({ value, range }: IsFullRangeProps): boolean {
  return value.min === range.min && value.max === range.max;
}
