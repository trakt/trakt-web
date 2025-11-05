import * as m from '$lib/features/i18n/messages.ts';

import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';

import { toHumanETA } from '$lib/utils/formatting/date/toHumanETA.ts';
import { toRelativeHumanDay } from '$lib/utils/formatting/date/toRelativeHumanDay.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import { toTranslatedValue } from '$lib/utils/formatting/string/toTranslatedValue.ts';
import type { TagIntl } from './TagIntl.ts';
import { toHumanDay } from '$lib/utils/formatting/date/toHumanDay.ts';

export const TagIntlProvider: TagIntl = {
  toDuration: (duration) =>
    toHumanDuration({ minutes: duration }, languageTag()),
  toEpisodeCount: (count) => m.tag_text_number_of_episodes({ count }),
  toPlayCount: (count) =>
    m.tag_text_plays({ number: toHumanNumber(count, languageTag()) }),
  toWatcherCount: (count) => toHumanNumber(count, languageTag()),
  toReleaseEstimate: (airDate) => toHumanETA(new Date(), airDate, getLocale()),
  toActivityDate: (activityDate) =>
    toRelativeHumanDay(new Date(), activityDate, getLocale()),
  tbaLabel: () => m.tag_text_tba(),
  toAnticipatedCount: (count) => toHumanNumber(count, languageTag()),
  watchCountLabel: () => m.tag_text_watch_count(),
  trendLabel: (delta) =>
    delta ? toHumanNumber(Math.abs(delta), languageTag()) : '—',
  postCredits: (count) =>
    `${toHumanNumber(count, languageTag())} · ${m.header_post_credits()}`,
  mediaTypeLabel: (type) => toTranslatedValue('type', type),
  toDay: (date) => toHumanDay(date, getLocale()),
};
