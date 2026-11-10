import { getLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanETA } from '$lib/utils/formatting/date/toHumanETA.ts';
import { toHumanWeekdayDate } from '$lib/utils/formatting/date/toHumanWeekdayDate.ts';
import type { AwardGroup } from './models/AwardGroup.ts';
import { toAwardEdition } from './toAwardEdition.ts';
import { toAwardName } from './toAwardName.ts';

type ToAwardLiveTextProps = {
  groups: ReadonlyArray<AwardGroup>;
  today: Date;
};

function toLatestCeremony(group: AwardGroup) {
  return group.entries.find((entry) => entry.year === group.years.at(0))
    ?.ceremony;
}

function toUpcomingText(group: AwardGroup, today: Date) {
  if (!group.heldAt) return null;

  const locale = getLocale();
  return m.text_award_live_upcoming({
    awards: toAwardName({ ceremony: group.key, count: 2 }),
    date: toHumanWeekdayDate(group.heldAt, locale),
    eta: toHumanETA(today, group.heldAt, locale),
  });
}

function toWinnersText(group: AwardGroup) {
  const ceremony = toLatestCeremony(group);
  if (!ceremony) return null;

  return m.text_award_live_winners({ ceremony: toAwardEdition(ceremony) });
}

export function toAwardLiveText({
  groups,
  today,
}: ToAwardLiveTextProps): string | null {
  const live = groups.find((group) => group.phase !== 'none');
  if (!live) return null;

  return live.phase === 'pre'
    ? toUpcomingText(live, today)
    : toWinnersText(live);
}
