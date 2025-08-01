import * as m from '$lib/features/i18n/messages.ts';

import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';

import { toHumanETA } from '$lib/utils/formatting/date/toHumanETA.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import type { TagIntl } from './TagIntl.ts';

export const TagIntlProvider: TagIntl = {
  toDuration: (duration) =>
    toHumanDuration({ minutes: duration }, languageTag()),
  toEpisodeCount: (count) => m.tag_text_number_of_episodes({ count }),
  toPlayCount: (count) =>
    m.tag_text_plays({ number: toHumanNumber(count, languageTag()) }),
  toWatcherCount: (count) => toHumanNumber(count, languageTag()),
  toReleaseEstimate: (airDate) => toHumanETA(new Date(), airDate, getLocale()),
  tbaLabel: () => m.tag_text_tba(),
  toAnticipatedCount: (count) => toHumanNumber(count, languageTag()),
  watchCountLabel: () => m.tag_text_watch_count(),
  trendLabel: (delta) =>
    delta ? toHumanNumber(Math.abs(delta), languageTag()) : '—',
};
