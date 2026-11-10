import * as m from '$lib/features/i18n/messages.ts';
import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';
import type { AwardTally } from './models/AwardTally.ts';
import { toAwardName } from './toAwardName.ts';
import { toAwardPrize } from './toAwardPrize.ts';
import { toNominationCount } from './toNominationCount.ts';

type AwardSummaryPart = {
  id: string;
  ceremony: AwardCeremonyKey;
  kind: AwardTally['kind'];
  message: string;
};

const bold = (text: string) => `<b>${text}</b>`;

function toMessage({ ceremony, kind, wins, nominations }: AwardTally) {
  switch (kind) {
    case 'festival':
      return bold(toAwardPrize(ceremony));
    case 'wins':
      return m.text_award_summary_wins({
        awards: bold(
          m.text_award_count({
            count: wins,
            award: toAwardName({ ceremony, count: wins }),
          }),
        ),
        nominations: toNominationCount(nominations),
      });
    case 'nominations': {
      const award = toAwardName({ ceremony, count: 1 });
      return bold(
        nominations === 1
          ? m.text_award_nomination_summary_one({ count: nominations, award })
          : m.text_award_nomination_summary_other({
              count: nominations,
              award,
            }),
      );
    }
  }
}

export function toAwardSummaryParts(
  tallies: ReadonlyArray<AwardTally>,
): AwardSummaryPart[] {
  return tallies.map((tally) => ({
    id: tally.id,
    ceremony: tally.ceremony,
    kind: tally.kind,
    message: toMessage(tally),
  }));
}
