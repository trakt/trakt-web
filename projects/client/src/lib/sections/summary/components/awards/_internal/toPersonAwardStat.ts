import * as m from '$lib/features/i18n/messages.ts';
import type { AwardLabel } from './models/AwardLabel.ts';
import type { AwardTally } from './models/AwardTally.ts';
import { toAwardPrize } from './toAwardPrize.ts';
import { toNominationCount } from './toNominationCount.ts';

function toWinCount(count: number) {
  return count === 1
    ? m.text_award_wins_one({ count })
    : m.text_award_wins_other({ count });
}

export function toPersonAwardStat(tally: AwardTally): AwardLabel {
  switch (tally.kind) {
    case 'festival':
      return { count: null, text: toAwardPrize(tally.ceremony) };
    case 'wins':
      return {
        count: toWinCount(tally.wins),
        text: `· ${toNominationCount(tally.nominations)}`,
      };
    case 'nominations':
      return { count: null, text: toNominationCount(tally.nominations) };
  }
}
