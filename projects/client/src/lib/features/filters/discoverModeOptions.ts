import type { ToggleOption } from '$lib/components/toggles/ToggleOption.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { DISCOVER_MODE_PARAM } from './_internal/constants.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';

type DiscoverModeOption = {
  value: DiscoverMode;
  label: string;
  href: string;
};

export function discoverModeOptions(
  options: ReadonlyArray<ToggleOption<DiscoverMode>>,
): DiscoverModeOption[] {
  return options.map((option) => ({
    value: option.value,
    label: option.text(),
    href: buildParamString({ [DISCOVER_MODE_PARAM]: option.value }),
  }));
}
