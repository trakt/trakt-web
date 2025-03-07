import * as m from '$lib/features/i18n/messages.ts';

import { getLocale, languageTag } from '$lib/features/i18n/index.ts';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration.ts';

import { toHumanETA } from '$lib/utils/formatting/date/toHumanETA.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
import type { TagIntl } from './TagIntl.ts';

export const TagIntlProvider: TagIntl = {
  toDuration: (duration) =>
    toHumanDuration({ minutes: duration }, languageTag()),
  toEpisodeCount: (count) => m.number_of_episodes({ count }),
  toPlayCount: (count) =>
    m.plays({ number: toHumanNumber(count, languageTag()) }),
  toWatcherCount: (count) =>
    m.active_watchers({ count: toHumanNumber(count, languageTag()) }),
  toReleaseEstimate: (airDate) => toHumanETA(new Date(), airDate, getLocale()),
  tbaLabel: () => m.tba_label(),
  toAnticipatedCount: (count) =>
    m.anticipated_count({ count: toHumanNumber(count, languageTag()) }),
  watchCountLabel: (isShow) =>
    isShow ? m.watched_episodes_count_label() : m.watch_count_label(),
};
