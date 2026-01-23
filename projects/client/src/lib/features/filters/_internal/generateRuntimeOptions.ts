import type { FilterOption } from '$lib/features/filters/models/Filter.ts';
import * as m from '$lib/features/i18n/messages.ts';

const RUNTIME_RANGES = [
  { value: '0-90', label: m.filter_label_runtime({ range: '0-90' }) },
  { value: '91-120', label: m.filter_label_runtime({ range: '91-120' }) },
  { value: '121-', label: m.filter_label_runtime({ range: '121+' }) },
];

export function generateRuntimeOptions(): FilterOption[] {
  return RUNTIME_RANGES.map(({ value, label }) => ({
    label,
    value,
  }));
}
