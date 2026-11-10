import * as m from '$lib/features/i18n/messages.ts';
import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';

type ToAwardNameProps = {
  ceremony: AwardCeremonyKey;
  count: number;
};

const AWARD_NAMES: Record<
  AwardCeremonyKey,
  { one: () => string; other: () => string }
> = {
  oscars: {
    one: m.text_award_name_oscars_one,
    other: m.text_award_name_oscars_other,
  },
  'golden-globes': {
    one: m.text_award_name_golden_globes_one,
    other: m.text_award_name_golden_globes_other,
  },
  emmys: {
    one: m.text_award_name_emmys_one,
    other: m.text_award_name_emmys_other,
  },
  'emmys-creative-arts': {
    one: m.text_award_name_emmys_creative_arts_one,
    other: m.text_award_name_emmys_creative_arts_other,
  },
  cannes: {
    one: m.text_award_name_cannes_one,
    other: m.text_award_name_cannes_other,
  },
  venice: {
    one: m.text_award_name_venice_one,
    other: m.text_award_name_venice_other,
  },
  berlin: {
    one: m.text_award_name_berlin_one,
    other: m.text_award_name_berlin_other,
  },
  other: {
    one: m.text_award_name_other_one,
    other: m.text_award_name_other_other,
  },
};

export function toAwardName({ ceremony, count }: ToAwardNameProps): string {
  const names = AWARD_NAMES[ceremony];
  return count === 1 ? names.one() : names.other();
}
