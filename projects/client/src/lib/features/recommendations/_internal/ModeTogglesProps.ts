import type { ToggleOption } from '$lib/components/toggles/ToggleOption.ts';
import type { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';

export type ModeTogglesProps<T extends string> = {
  flag: FeatureFlag;
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
};
