import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import type { StarRating } from '$lib/sections/summary/components/rating/models/StarRating.ts';

type FilterValueMapper = {
  mapper?: (user: UserSettings) => string;
};

export type FilterOption = {
  label: string;
  value: string;
} & FilterValueMapper;

export type RatingOption = {
  rating: StarRating;
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

export type MultiSelectOption = {
  type: 'multi-select';
};

export type AdvancedOption = SliderOption | MultiSelectOption;
