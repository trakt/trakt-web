import * as m from '$lib/features/i18n/messages';

import { getLocale, languageTag } from '$lib/features/i18n';
import { toHumanDuration } from '$lib/utils/formatting/date/toHumanDuration';

import { toHumanETA } from '$lib/utils/formatting/date/toHumanETA';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber';
import type { TagIntl } from './TagIntl';

export const TagIntlProvider: TagIntl = {
  toDuration: (duration) =>
    toHumanDuration({ minutes: duration }, languageTag()),
  toEpisodeCount: (count) => m.number_of_episodes({ count }),
  toPlayCount: (count) =>
    m.plays({ number: toHumanNumber(count, languageTag()) }),
  toWatcherCount: (count) => m.active_watchers({ count }),
  toReleaseEstimate: (airDate) => toHumanETA(new Date(), airDate, getLocale()),
  tbaLabel: () => m.tba_label(),
  toAnticipatedCount: (count) =>
    m.anticipated_count({ count: toHumanNumber(count, languageTag()) }),
};
