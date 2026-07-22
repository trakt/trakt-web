import type { SegmentedSelectOption } from '$lib/components/select/models/SegmentedSelectOption.ts';
import type { ToggleOption } from '$lib/components/toggles/ToggleOption.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { DISCOVER_MODE_PARAM } from './_internal/constants.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';

export function discoverModeOptions(
  options: ReadonlyArray<ToggleOption<DiscoverMode>>,
): SegmentedSelectOption<DiscoverMode>[] {
  return options.map((option) => ({
    value: option.value,
    label: option.text(),
    href: buildParamString({ [DISCOVER_MODE_PARAM]: option.value }),
  }));
}
