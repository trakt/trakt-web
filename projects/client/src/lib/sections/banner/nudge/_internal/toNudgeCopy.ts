import * as m from '$lib/features/i18n/messages.ts';
import type { NudgeLimit } from '$lib/requests/models/Nudge.ts';
import type { NudgeCard } from './toNudgeCard.ts';

type NudgeCopy = {
  title: string;
  detail: string;
  shortDetail: string;
};

type CountCopy = (counts: { used: string; total: string }) => string;

const OVER_LIMIT: Record<NudgeLimit, CountCopy> = {
  watchlistItems: m.vip_nudge_over_watchlist_items,
  totalListItems: m.vip_nudge_over_list_items,
  staticLists: m.vip_nudge_over_lists,
  totalNotes: m.vip_nudge_over_notes,
};

const WITHIN_LIMIT: Record<NudgeLimit, CountCopy> = {
  watchlistItems: m.vip_nudge_within_watchlist_items,
  totalListItems: m.vip_nudge_within_list_items,
  staticLists: m.vip_nudge_within_lists,
  totalNotes: m.vip_nudge_within_notes,
};

const VIP_LIMIT: Record<NudgeLimit, (vip: string) => string> = {
  watchlistItems: (vip) => m.vip_nudge_vip_limit_watchlist_items({ vip }),
  totalListItems: (vip) => m.vip_nudge_vip_limit_list_items({ vip }),
  staticLists: () => m.vip_nudge_vip_limit_lists(),
  totalNotes: (vip) => m.vip_nudge_vip_limit_notes({ vip }),
};

type ToNudgeCopyParams = {
  card: NudgeCard;
  format: (value: number) => string;
};

export function toNudgeCopy({ card, format }: ToNudgeCopyParams): NudgeCopy {
  if (card.kind === 'feature') {
    const watchlist = format(card.amounts.watchlistItems);

    return {
      title: m.vip_nudge_feature_title(),
      detail: m.vip_nudge_feature_body({
        watchlist,
        listItems: format(card.amounts.totalListItems),
        notes: format(card.amounts.totalNotes),
      }),
      shortDetail: m.vip_nudge_feature_body_short({ watchlist }),
    };
  }

  const counts = { used: format(card.used), total: format(card.total) };
  const copy = card.state === 'over' ? OVER_LIMIT : WITHIN_LIMIT;
  const detail = VIP_LIMIT[card.metric](format(card.vip));

  return {
    title: copy[card.metric](counts),
    detail,
    shortDetail: detail,
  };
}
