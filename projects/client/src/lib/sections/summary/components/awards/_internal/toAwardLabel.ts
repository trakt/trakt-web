import * as m from '$lib/features/i18n/messages.ts';
import type { AwardLabel } from './models/AwardLabel.ts';
import type { AwardTally } from './models/AwardTally.ts';
import { toAwardName } from './toAwardName.ts';
import { toAwardPrize } from './toAwardPrize.ts';

function toWinsLabel({ ceremony, wins }: AwardTally): AwardLabel {
  if (wins === 1) {
    return {
      count: null,
      text: m.text_award_winner({
        award: toAwardName({ ceremony, count: 1 }),
      }),
    };
  }

  return { count: wins, text: toAwardName({ ceremony, count: wins }) };
}

function toNominationsLabel({ ceremony, nominations }: AwardTally): AwardLabel {
  const award = toAwardName({ ceremony, count: 1 });

  if (nominations === 1) {
    return { count: null, text: m.text_award_nominee({ award }) };
  }

  return { count: nominations, text: m.text_award_nominations({ award }) };
}

export function toAwardLabel(tally: AwardTally): AwardLabel {
  switch (tally.kind) {
    case 'festival':
      return { count: null, text: toAwardPrize(tally.ceremony) };
    case 'wins':
      return toWinsLabel(tally);
    case 'nominations':
      return toNominationsLabel(tally);
  }
}
