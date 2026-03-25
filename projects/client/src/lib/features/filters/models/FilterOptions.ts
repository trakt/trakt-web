import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import type { FilterKey } from './Filter.ts';

type FilterValueMapper = {
  mapper?: (user: UserSettings) => string;
};

export type AdditionalKey = {
  key: FilterKey;
  mapper?: (range: { min: number; max: number }) => string;
};

type MultiKeyFilter = {
  additionalKeys?: AdditionalKey[];
};

export type FilterOption = {
  label: string;
  value: string;
} & FilterValueMapper;

export type SliderOption = {
  type: 'slider';
  range: { min: number; max: number };
  formatLabel: (value: { min: number; max: number }) => string;
  ticks?: {
    count: number;
    formatter: (value: number) => string;
  };
};

export type AdvancedSliderOption = SliderOption & MultiKeyFilter;

export type MultiSelectOption = {
  type: 'multi-select';
  label?: string;
  options?: ReadonlyArray<FilterOption>;
};

export type AdvancedOption = AdvancedSliderOption | MultiSelectOption;
