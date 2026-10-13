import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import type { FilterSettingsSlot } from './FilterSettingsSlot.ts';

export type FilterSettingsResolver = (
  key: FilterKey,
) => FilterSettingsSlot | undefined;
