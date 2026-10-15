import type { SliderProps } from '$lib/components/slider/models/SliderProps.ts';
import type { SliderRange } from '$lib/components/slider/models/SliderRange.ts';

export type SliderFieldProps =
  & Pick<SliderProps, 'range' | 'value' | 'step' | 'ticks' | 'disabled'>
  & {
    label?: string;
    formatLabel?: (value: SliderRange) => string;
    onCommit: (value: SliderRange) => void;
  };
