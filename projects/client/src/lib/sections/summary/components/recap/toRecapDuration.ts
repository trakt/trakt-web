import { languageTag } from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';
import { toReadingMinutes } from '$lib/utils/string/toReadingMinutes.ts';

export function toRecapDuration(texts: ReadonlyArray<string>) {
  return toHumanDuration(
    { minutes: toReadingMinutes(texts), unitDisplay: 'short' },
    languageTag(),
  );
}
